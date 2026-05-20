using Microsoft.EntityFrameworkCore;
using UniSphere.Core.AI.DTOs;
using UniSphere.Core.AI.Interfaces;
using UniSphere.Core.Entities;
using UniSphere.Infrastructure.Data;

namespace UniSphere.Infrastructure.Services;

public class RecommendationService : IRecommendationService
{
    private readonly AppDbContext _context;

    public RecommendationService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<RecommendationResultDto>> GetRecommendationsAsync(RecommendationRequestDto request)
    {
        var now = DateTime.UtcNow;

        var userApplications = await _context.Applications
            .AsNoTracking()
            .Include(x => x.Event)
            .Where(x => x.UserId == request.UserId)
            .ToListAsync();

        var appliedEventIds = userApplications.Select(x => x.EventId).ToHashSet();
        var checkedInEventIds = userApplications
            .Where(x => x.Status == ApplicationStatus.CheckedIn)
            .Select(x => x.EventId)
            .ToHashSet();

        var historyEvents = userApplications
            .Where(x => x.Event != null && (x.Status == ApplicationStatus.Approved || x.Status == ApplicationStatus.CheckedIn))
            .Select(x => x.Event)
            .ToList();

        var topCategories = historyEvents
            .Where(e => !string.IsNullOrWhiteSpace(e.Category))
            .GroupBy(e => e.Category)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .ToList();

        var topClubs = historyEvents
            .GroupBy(e => e.ClubId)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .ToList();

        var userReviews = await _context.Reviews
            .AsNoTracking()
            .Where(x => x.UserId == request.UserId)
            .ToListAsync();

        var memberClubIds = await _context.ClubMemberships
            .AsNoTracking()
            .Where(x => x.UserId == request.UserId && x.Status == "Active")
            .Select(x => x.ClubId)
            .ToListAsync();

        var upcomingEvents = await _context.Events
            .AsNoTracking()
            .Include(e => e.Club)
            .Where(e => !appliedEventIds.Contains(e.Id))
            .ToListAsync();

        var results = new List<RecommendationResultDto>();

        foreach (var ev in upcomingEvents.Where(e => e.EventDate >= now))
        {
            var score = 0d;
            var explanations = new List<AIExplanationDto>();

            if (!string.IsNullOrWhiteSpace(ev.Category) && topCategories.Contains(ev.Category))
            {
                var rank = topCategories.IndexOf(ev.Category);
                var weight = rank == 0 ? 30 : 15;
                score += weight;
                explanations.Add(new AIExplanationDto
                {
                    Code = rank == 0 ? "top_category" : "matched_category",
                    Message = rank == 0
                        ? "En cok katildigin kategoriyle eslesiyor."
                        : "Gecmis etkinlik ilgilerine yakin bir kategori.",
                    Weight = weight
                });
            }

            if (topClubs.Contains(ev.ClubId))
            {
                var checkInsForClub = historyEvents.Count(x => x.ClubId == ev.ClubId && checkedInEventIds.Contains(x.Id));
                var weight = checkInsForClub > 0 ? 35 : 20;
                score += weight;
                explanations.Add(new AIExplanationDto
                {
                    Code = checkInsForClub > 0 ? "attended_club" : "known_club",
                    Message = checkInsForClub > 0
                        ? "Bu kulubun etkinliklerine daha once check-in yaptin."
                        : "Daha once ilgi gosterdigin bir kulubun etkinligi.",
                    Weight = weight
                });
            }

            if (memberClubIds.Contains(ev.ClubId))
            {
                score += 15;
                explanations.Add(new AIExplanationDto
                {
                    Code = "club_membership",
                    Message = "Uyesi oldugun kulubun etkinligi.",
                    Weight = 15
                });
            }

            var reviewsForCategory = userReviews
                .Where(r => historyEvents.Any(he => he.Id == r.EventId && he.Category == ev.Category))
                .ToList();

            if (reviewsForCategory.Count > 0)
            {
                var avgRating = reviewsForCategory.Average(r => r.Rating);
                if (avgRating >= 4)
                {
                    score += 20;
                    explanations.Add(new AIExplanationDto
                    {
                        Code = "high_rating_category",
                        Message = "Bu tur etkinliklere daha once yuksek puan verdin.",
                        Weight = 20
                    });
                }
                else if (avgRating <= 2)
                {
                    score -= 20;
                    explanations.Add(new AIExplanationDto
                    {
                        Code = "low_rating_category",
                        Message = "Bu kategoride gecmis puanlarin dusuk oldugu icin oncelik azaltildi.",
                        Weight = -20
                    });
                }
            }

            if (request.InterestedCategories.Contains(ev.Category))
            {
                score += 20;
                explanations.Add(new AIExplanationDto
                {
                    Code = "profile_interest",
                    Message = "Profil ilgi alanlarinla eslesiyor.",
                    Weight = 20
                });
            }

            score = Math.Clamp(score, 0, 100);
            if (score <= 0)
            {
                continue;
            }

            var reason = string.Join(" ", explanations.Select(x => x.Message));

            results.Add(new RecommendationResultDto
            {
                EventId = ev.Id,
                EventTitle = ev.Name,
                ClubName = ev.Club?.Name ?? string.Empty,
                Score = Math.Round(score, 2),
                Reason = string.IsNullOrWhiteSpace(reason) ? "Kampus etkinlik gecmisine gore one cikarildi." : reason,
                Explanations = explanations,
                Meta = new AIResponseMetaDto
                {
                    Model = "recommendation-rule-based",
                    Version = "v1",
                    GeneratedAt = now,
                    IsDecisionSupportOnly = false
                }
            });
        }

        return results
            .OrderByDescending(x => x.Score)
            .ThenBy(x => x.EventTitle)
            .Take(5)
            .ToList();
    }
}
