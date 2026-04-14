using UniSphere.Infrastructure.Data;
using UniSphere.Core.AI.DTOs;
using UniSphere.Core.AI.Interfaces;
using UniSphere.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace UniSphere.Infrastructure.Services;

public class NoShowPredictionService : INoShowPredictionService
{
    private readonly AppDbContext _context;

    public NoShowPredictionService(AppDbContext context)
    {
        _context = context;
    }

    public NoShowResultDto Predict(NoShowRequestDto request)
    {
        // 1. Hedef etkinlik bilgilerini veritabanından alıyoruz.
        // Hedef etkinliğin hafta sonu olup olmadığını analiz edebilmek için gerekiyor.
        var targetEvent = _context.Events.FirstOrDefault(e => e.Id == request.EventId);
        bool targetIsWeekend = false;
        
        if (targetEvent != null)
        {
            var dayOfWeek = targetEvent.EventDate.DayOfWeek;
            targetIsWeekend = dayOfWeek == DayOfWeek.Saturday || dayOfWeek == DayOfWeek.Sunday;
        }

        // 2. Kullanıcının geçmiş başvurularını ve bu başvurulara bağlı event tarihlerini (Include ile) alıyoruz.
        // Tarihe göre artan (veya azalan) sıralayarak zaman trendlerini ölçmemiz mümkün.
        var pastApplications = _context.Applications
            .Include(a => a.Event)
            .Where(x => x.UserId == request.UserId && x.EventId != request.EventId)
            .OrderByDescending(x => x.CreatedAt)
            .ToList();

        // Admin panelinde görünecek nedenler (Insights)
        var reasons = new List<string>();
        
        // Temel metrikler
        int totalApps = pastApplications.Count;
        int checkInCount = pastApplications.Count(a => a.Status == ApplicationStatus.CheckedIn);
        int noShowCount = pastApplications.Count(a => a.Status == ApplicationStatus.Approved && a.CheckedInAt == null && a.Event != null && a.Event.EventDate < DateTime.UtcNow);
        int cancelledCount = pastApplications.Count(a => a.Status == ApplicationStatus.Cancelled);
        
        // --- 3. Feature Engineering & Risk Puanlama (Rule-based Heuristics) ---
        // Başlangıç riski (Base Score - Eğer kullanıcının hiç verisi yoksa orta riske yatkın tutulur veya düşük verilir. Burada nötr başlıyoruz)
        double riskScore = 30.0; 

        if (totalApps == 0)
        {
            reasons.Add("Kullanıcının geçmiş etkinlik verisi bulunmuyor, sistem varsayılan risk puanı atadı.");
        }
        else
        {
            // A. Tarihsel Katılım Oranı (Historical No-Show Rate)
            // Daha önce onaylanıp da hiç gitmediği durumların, tüm geçerli başvurulara oranı.
            int validApps = checkInCount + noShowCount;
            if (validApps > 0)
            {
                double historicalNoShowRate = (double)noShowCount / validApps;
                
                if (historicalNoShowRate > 0.5)
                {
                    riskScore += 35; // %50'den fazla etkinliğe gitmemiş
                    reasons.Add($"Genel katılım geçmişi kötü: Onaylanan {validApps} etkinlikten {noShowCount} tanesine katılmamış.");
                }
                else if (historicalNoShowRate <= 0.2)
                {
                    riskScore -= 20; // Güvenilir kullanıcı
                }
            }

            // B. Son Etkinlik İvmesi (Recent Trend)
            // Kullanıcının en son 3 etkinliğindeki davranışı (Eğer son 3 etkinliğe de onaylanıp gitmediyse durum çok kritik)
            var lastThreeValidApps = pastApplications
                .Where(a => a.Status == ApplicationStatus.CheckedIn || (a.Status == ApplicationStatus.Approved && a.Event != null && a.Event.EventDate < DateTime.UtcNow))
                .Take(3)
                .ToList();

            int recentNoShows = lastThreeValidApps.Count(a => a.CheckedInAt == null && a.Status == ApplicationStatus.Approved);
            
            if (lastThreeValidApps.Count > 0 && recentNoShows == lastThreeValidApps.Count)
            {
                riskScore += 25;
                reasons.Add("Kullanıcı onay aldığı son etkinliklerinin tamamına katılmadı (Kronik No-Show eğilimi).");
            }
            else if (lastThreeValidApps.Count == 3 && recentNoShows == 0)
            {
                riskScore -= 15; // Son zamanlarda hep katılmış
                reasons.Add("Son etkinliklerin hepsine eksiksiz katılım sağladı.");
            }

            // C. İptal Alışkanlığı (Cancellation Habit)
            // Kullanıcı çok sık iptal ediyorsa bu no-show riski kadar tehlikeli olmasa da sisteme yük getirdiği için uyarıcıdır.
            if (totalApps > 0 && ((double)cancelledCount / totalApps) > 0.4)
            {
                riskScore += 10;
                reasons.Add("Kullanıcının başvurularını sonradan iptal etme alışkanlığı yüksek.");
            }

            // D. Zaman Kırılımı İlgisi (Temporal Preference)
            // Hedef etkinlik bir "Hafta Sonu" etkinliğiyse ve kullanıcının geçmişte hafta sonuna katılımı çok düşükse risk artar.
            if (targetIsWeekend)
            {
                var pastWeekendValidApps = pastApplications
                    .Where(a => a.Event != null && (a.Event.EventDate.DayOfWeek == DayOfWeek.Saturday || a.Event.EventDate.DayOfWeek == DayOfWeek.Sunday) && (a.Status == ApplicationStatus.CheckedIn || (a.Status == ApplicationStatus.Approved && a.CheckedInAt == null && a.Event.EventDate < DateTime.UtcNow)))
                    .ToList();

                if (pastWeekendValidApps.Count > 0)
                {
                    int pastWeekendNoShows = pastWeekendValidApps.Count(a => a.CheckedInAt == null);
                    double weekendNoShowRate = (double)pastWeekendNoShows / pastWeekendValidApps.Count;

                    if (weekendNoShowRate >= 0.6)
                    {
                        riskScore += 15;
                        reasons.Add("Bu bir hafta sonu etkinliği ve kullanıcının hafta sonu etkinliklerine gelmeme oranı oldukça yüksek.");
                    }
                }
            }
        }

        // Skor Sınırlandırması (Clamping 0 - 100)
        riskScore = Math.Clamp(riskScore, 0, 100);

        // 4. Eşik Değerleri Belirleme (Thresholds)
        string riskLevel;
        if (riskScore >= 66)
        {
            riskLevel = "High";
        }
        else if (riskScore >= 36)
        {
            riskLevel = "Medium";
        }
        else
        {
            riskLevel = "Low";
            if(reasons.Count == 0) 
            {
                reasons.Add("Kullanıcının katılım geçmişi olumlu ve risk teşkil eden bir patern bulunmadı.");
            }
        }

        return new NoShowResultDto
        {
            RiskLevel = riskLevel,
            Score = Math.Round(riskScore, 2),
            Reasons = reasons,
            Meta = new AIResponseMetaDto
            {
                Model = "noshow-v2.heuristics",
                GeneratedAt = DateTime.UtcNow
            }
        };
    }
}
