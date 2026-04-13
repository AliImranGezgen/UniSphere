using UniSphere.Infrastructure.Data;
using UniSphere.Core.AI.DTOs;
using UniSphere.Core.AI.Interfaces;
using UniSphere.Core.Entities;

namespace UniSphere.Infrastructure.Services;

public class RecommendationService : IRecommendationService
{
    private readonly AppDbContext _context;

    public RecommendationService(AppDbContext context)
    {
        _context = context;
    }

    public List<RecommendationResultDto> GetRecommendations(RecommendationRequestDto request)
    {
        var results = new List<RecommendationResultDto>();

        // Tüm etkinlikleri veritabanından alıyoruz.
        var events = _context.Events.ToList();

        // 1. Application Geçmişi
        var userApplications = _context.Applications
            .Where(x => x.UserId == request.UserId)
            .ToList();

        var appliedEventIds = userApplications.Select(x => x.EventId).ToHashSet();

        // 2. Check-in Geçmişi
        var checkedInEventIds = userApplications
            .Where(x => x.Status == ApplicationStatus.CheckedIn)
            .Select(x => x.EventId)
            .ToHashSet();

        // 3. Review Geçmişi
        var userReviews = _context.Reviews
            .Where(x => x.UserId == request.UserId)
            .ToList();

        // Profil çıkarmak için geçmiş etkinlikleri alıyoruz
        var attendedOrApprovedEventIds = userApplications
            .Where(x => x.Status == ApplicationStatus.Approved || x.Status == ApplicationStatus.CheckedIn)
            .Select(x => x.EventId)
            .ToList();

        var historyEvents = _context.Events
            .Where(e => attendedOrApprovedEventIds.Contains(e.Id))
            .ToList();

        var topCategories = historyEvents
            .GroupBy(e => e.Category)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .ToList();

        var topClubs = historyEvents
            .GroupBy(e => e.ClubId)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .ToList();

        foreach (var ev in events)
        {
            // Kullanıcının daha önce başvurduğu etkinlikleri önerme. İleri tarihli olmayanları önerme.
            if (ev.EventDate < DateTime.UtcNow) continue;
            if (appliedEventIds.Contains(ev.Id)) continue;
            
            double score = 0;
            var reasons = new List<string>();

            // --- SKORLAMA MANTIĞI (Kural Tabanlı Hibrit Ön Hazırlık) ---

            // Kural 1: Kategori / Kulüp (Application Geşmişi Etkisi)
            if (topCategories.Contains(ev.Category))
            {
                var categoryRank = topCategories.IndexOf(ev.Category);
                if (categoryRank == 0)
                {
                    score += 0.3;
                    reasons.Add("En çok katıldığınız kategori.");
                }
                else
                {
                    score += 0.15;
                    reasons.Add("İlgi alanınıza uygun.");
                }
            }

            // Kural 2: Kulüp & Check-in Geçmişi
            if (topClubs.Contains(ev.ClubId))
            {
                var checkInsForThisClub = historyEvents.Count(he => he.ClubId == ev.ClubId && checkedInEventIds.Contains(he.Id));
                if (checkInsForThisClub > 0)
                {
                    score += 0.35; // Check-in yapmış olması skoru yükseltir
                    reasons.Add("Etkinliklerine düzenli katıldığınız bir kulüp.");
                }
                else
                {
                    score += 0.2;
                    reasons.Add("Takip ettiğiniz kulübün etkinliği.");
                }
            }

            // Kural 3: Review Geçmişi
            var reviewsForThisCategory = userReviews
                .Where(r => historyEvents.Any(he => he.Id == r.EventId && he.Category == ev.Category))
                .ToList();

            if (reviewsForThisCategory.Any())
            {
                var avgRating = reviewsForThisCategory.Average(r => r.Rating);
                if (avgRating >= 4.0)
                {
                    score += 0.2;
                    reasons.Add("Bu tür etkinliklere daha önce yüksek puan verdiniz.");
                }
                else if (avgRating <= 2.0)
                {
                    // Düşük puanlı kategorilerden kaçınma cezası
                    score -= 0.3;
                    reasons.Add("Daha önce bu kategoride düşük puan verdiğiniz için öncelik düşürüldü.");
                }
            }

            // İlgi alanları (Request üzerinden geldiyse)
            if (request.InterestedCategories.Contains(ev.Category))
            {
                score += 0.2;
                reasons.Add("Profilinizdeki ilgi alanlarıyla eşleşiyor.");
            }

            // Normalizasyon (0 ile 1 arasına sabitleme)
            score = Math.Max(score, 0);
            score = Math.Min(score, 1.0);

            // Sadece skoru olan etkinlikleri dahil edelim
            if (score > 0)
            {
                var explainability = string.Join(" ", reasons);
                if (string.IsNullOrWhiteSpace(explainability))
                {
                    explainability = "Sizin için öneriliyor.";
                }

                results.Add(new RecommendationResultDto
                {
                    EventId = ev.Id,
                    Score = Math.Round(score, 2),
                    Reason = explainability, // Explainability eklendi
                    RiskLevel = "N/A", // Risk tahminini modül dışında tuttuk
                    Meta = new AIResponseMetaDto
                    {
                        Model = "recommendation-hybrid-v2"
                    }
                });
            }
        }

        // Skorlara göre sırala ve ilk 5'i döndür
        return results
            .OrderByDescending(x => x.Score)
            .Take(5)
            .ToList();
    }
}
