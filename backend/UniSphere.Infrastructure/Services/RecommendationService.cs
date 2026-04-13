using UniSphere.Infrastructure.Data;
using UniSphere.Core.AI.DTOs;
using UniSphere.Core.AI.Interfaces;
using UniSphere.Core.Entities;

namespace UniSphere.Infrastructure.Services;

public class RecommendationService : IRecommendationService
{
    private readonly AppDbContext _context;
    private readonly INoShowPredictionService _noShowPredictionService;

    public RecommendationService(AppDbContext context, INoShowPredictionService noShowPredictionService)
    {
        _context = context;
        _noShowPredictionService = noShowPredictionService;
    }

    public List<RecommendationResultDto> GetRecommendations(RecommendationRequestDto request)
    {
        var results = new List<RecommendationResultDto>();

        var events = _context.Events.ToList();

        var userApplications = _context.Applications
            .Where(x => x.UserId == request.UserId)
            .ToList();

        var attendedEvents = userApplications
            .Where(x => x.Status == ApplicationStatus.Approved)
            .Select(x => x.EventId)
            .ToList();

        var userCategoryStats = _context.Applications
            .Where(x => x.UserId == request.UserId && x.Status == ApplicationStatus.Approved)
            .GroupBy(x => x.Event.Category)
            .Select(g => new
            {
                Category = g.Key,
                Count = g.Count()
            })
            .OrderByDescending(x => x.Count)
            .ToList();

        var topCategory = userCategoryStats.FirstOrDefault()?.Category;

        foreach (var ev in events)
        {
            if (userApplications.Any(x => x.EventId == ev.Id))
            {
                continue;
            }

            if (ev.EventDate < DateTime.UtcNow)
            {
                continue;
            }

            double score = 0;
            string reason = string.Empty;

            if (!string.IsNullOrEmpty(topCategory) && ev.Category == topCategory)
            {
                score += 0.3;
                reason += "En çok katıldığın kategoriye ait. ";
            }

            if (attendedEvents.Contains(ev.Id))
            {
                score += 0.3;
                reason += "Katıldığın etkinliklerle ilişkili. ";
            }

            if (request.InterestedCategories.Any())
            {
                score += 0.2;
                reason += "İlgi alanına uygun etkinlikler öneriliyor. ";
            }

            var popularity = _context.Applications.Count(x => x.EventId == ev.Id);
            score += popularity * 0.01;
            if (popularity > 0)
            {
                reason += "Popülerlik artışı sağlandı. ";
            }

            score += 0.1;

            var risk = _noShowPredictionService.Predict(new NoShowRequestDto
            {
                UserId = request.UserId,
                EventId = ev.Id
            });

            if (risk.RiskLevel == "High")
            {
                score -= 0.5;
                reason += "Katılmama ihtimali yüksek. ";
            }
            else if (risk.RiskLevel == "Medium")
            {
                score -= 0.2;
                reason += "Katılım riski orta. ";
            }
            else
            {
                score += 0.1;
                reason += "Katılmama riski düşük. ";
            }

            score = Math.Max(score, 0);
            score = Math.Min(score, 1.0);

            reason = string.IsNullOrWhiteSpace(reason)
                ? "Senin için önerildi."
                : reason.Trim();

            results.Add(new RecommendationResultDto
            {
                EventId = ev.Id,
                Score = Math.Round(score, 2),
                Reason = reason,
                RiskLevel = risk.RiskLevel,
                Meta = new AIResponseMetaDto
                {
                    Model = "recommendation-v1"
                }
            });
        }

        return results
            .OrderByDescending(x => x.Score)
            .Take(5)
            .ToList();
    }
}
