using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniSphere.Core.AI.DTOs;
using UniSphere.Core.AI.Interfaces;
using UniSphere.Core.Entities;
using UniSphere.Infrastructure.Data;

namespace UniSphere.API.Controllers;

[ApiController]
[Route("api/ai")]
[Authorize]
public class AIController : ControllerBase
{
    private readonly IRecommendationService _recommendationService;
    private readonly INoShowPredictionService _noShowPredictionService;
    private readonly AppDbContext _context;

    public AIController(
        IRecommendationService recommendationService,
        INoShowPredictionService noShowPredictionService,
        AppDbContext context)
    {
        _recommendationService = recommendationService;
        _noShowPredictionService = noShowPredictionService;
        _context = context;
    }

    [HttpGet("recommendations/me")]
    public async Task<IActionResult> GetMyRecommendations()
    {
        var userId = GetCurrentUserId();
        var result = await _recommendationService.GetRecommendationsAsync(new RecommendationRequestDto
        {
            UserId = userId
        });

        return Ok(result);
    }

    [HttpGet("recommend")]
    public Task<IActionResult> GetRecommendationsCompatibility()
    {
        return GetMyRecommendations();
    }

    [HttpGet("recommend-events/{userId:int}")]
    public async Task<IActionResult> GetRecommendationsForUserCompatibility(int userId)
    {
        if (!User.IsInRole(UserRoles.SystemAdmin) && userId != GetCurrentUserId())
        {
            return Forbid();
        }

        var result = await _recommendationService.GetRecommendationsAsync(new RecommendationRequestDto
        {
            UserId = userId
        });

        return Ok(result);
    }

    [HttpGet("noshow")]
    [Authorize(Roles = UserRoles.ClubAdmin + "," + UserRoles.SystemAdmin)]
    public async Task<IActionResult> GetNoShowCompatibility([FromQuery] int? userId, [FromQuery] int? eventId)
    {
        var target = await ResolveNoShowTargetAsync(userId, eventId);
        if (target is null)
        {
            return Ok(new NoShowResultDto
            {
                RiskLevel = "Low",
                Score = 0,
                Reasons = new List<string> { "Analiz edilecek onayli basvuru bulunamadi." },
                Meta = new AIResponseMetaDto
                {
                    Model = "noshow-v2.heuristics",
                    Version = "v1",
                    GeneratedAt = DateTime.UtcNow,
                    IsDecisionSupportOnly = true
                }
            });
        }

        return Ok(_noShowPredictionService.Predict(new NoShowRequestDto
        {
            UserId = target.Value.UserId,
            EventId = target.Value.EventId
        }));
    }

    [HttpPost("predict-noshow")]
    [Authorize(Roles = UserRoles.ClubAdmin + "," + UserRoles.SystemAdmin)]
    public async Task<IActionResult> PredictNoShowCompatibility([FromBody] NoShowPredictionRequestDto request)
    {
        if (!await CanManageEventAsync(request.EventId))
        {
            return Forbid();
        }

        var prediction = _noShowPredictionService.Predict(new NoShowRequestDto
        {
            UserId = request.UserId,
            EventId = request.EventId
        });

        return Ok(new NoShowPredictionDto
        {
            UserId = request.UserId,
            EventId = request.EventId,
            RiskLevel = prediction.RiskLevel,
            RiskScore = prediction.Score,
            Reason = string.Join(" ", prediction.Reasons)
        });
    }

    [HttpGet("events/{eventId:int}/no-show-risks")]
    [Authorize(Roles = UserRoles.ClubAdmin + "," + UserRoles.SystemAdmin)]
    public async Task<IActionResult> GetNoShowRisksForEvent(int eventId)
    {
        var canAccess = await CanManageEventAsync(eventId);
        if (!canAccess)
        {
            return Forbid();
        }

        var applications = await _context.Applications
            .AsNoTracking()
            .Include(a => a.User)
            .Include(a => a.Event)
            .Where(a => a.EventId == eventId && a.Status == ApplicationStatus.Approved)
            .OrderBy(a => a.User.Name)
            .ToListAsync();

        var risks = applications.Select(application =>
        {
            var prediction = _noShowPredictionService.Predict(new NoShowRequestDto
            {
                UserId = application.UserId,
                EventId = application.EventId
            });

            return new
            {
                applicationId = application.Id,
                userId = application.UserId,
                eventId = application.EventId,
                studentName = application.User.Name,
                eventTitle = application.Event.Name,
                riskLevel = prediction.RiskLevel,
                riskScore = prediction.Score,
                reason = string.Join(" ", prediction.Reasons),
                explanations = prediction.Reasons.Select(reason => new AIExplanationDto
                {
                    Code = "no_show_signal",
                    Message = reason
                }),
                meta = prediction.Meta
            };
        });

        return Ok(risks);
    }

    [HttpGet("no-show-risks")]
    [Authorize(Roles = UserRoles.ClubAdmin + "," + UserRoles.SystemAdmin)]
    public async Task<IActionResult> GetNoShowRisks()
    {
        var userId = GetCurrentUserId();
        var manageableClubIds = User.IsInRole(UserRoles.SystemAdmin)
            ? await _context.Clubs.AsNoTracking().Select(c => c.Id).ToListAsync()
            : await _context.ClubRoleAssignments
                .AsNoTracking()
                .Where(x =>
                    x.UserId == userId &&
                    (x.Role == ClubRoles.President ||
                     x.Role == ClubRoles.VicePresident ||
                     x.Role == ClubRoles.EventManager))
                .Select(x => x.ClubId)
                .ToListAsync();

        var eventIds = await _context.Events
            .AsNoTracking()
            .Where(e => manageableClubIds.Contains(e.ClubId))
            .Select(e => e.Id)
            .ToListAsync();

        var allRisks = new List<object>();
        foreach (var eventId in eventIds)
        {
            var response = await GetNoShowRisksForEvent(eventId) as OkObjectResult;
            if (response?.Value is IEnumerable<object> values)
            {
                allRisks.AddRange(values);
            }
        }

        return Ok(allRisks);
    }

    [HttpGet("suspicious-reviews")]
    [Authorize(Roles = UserRoles.SystemAdmin)]
    public async Task<IActionResult> GetSuspiciousReviews()
    {
        var reviews = await _context.Reviews
            .AsNoTracking()
            .Include(r => r.Event)
            .Include(r => r.User)
            .OrderByDescending(r => r.CreatedAt)
            .Take(50)
            .ToListAsync();

        var result = reviews
            .Select(review => AnalyzeReview(review.Id, review.Comment, review.Rating, review.CreatedAt, review.Event.Name, review.User.Name))
            .Where(x => x.RiskLevel != "Low")
            .ToList();

        return Ok(result);
    }

    [HttpPost("detect-suspicious-review")]
    [Authorize(Roles = UserRoles.SystemAdmin)]
    public IActionResult DetectSuspiciousReview([FromBody] SuspiciousReviewRequestDto request)
    {
        return Ok(AnalyzeReview(request.ReviewId, request.Comment, null, DateTime.UtcNow, string.Empty, string.Empty));
    }

    [HttpPost("improve-description")]
    [Authorize(Roles = UserRoles.ClubAdmin + "," + UserRoles.SystemAdmin)]
    public IActionResult ImproveDescription([FromBody] DescriptionImprovementRequestDto request)
    {
        var originalText = request.OriginalText?.Trim() ?? string.Empty;
        var improvedText = string.IsNullOrWhiteSpace(originalText)
            ? "Etkinligin amaci, hedef kitlesi, program akisi ve katilimcilara saglayacagi kazanımlar net sekilde aciklanmalidir."
            : $"{originalText} Etkinlik boyunca katilimcilar konuya dair uygulanabilir bilgiler edinecek ve soru-cevap bolumunde merak ettiklerini paylasabilecektir.";

        return Ok(new DescriptionImprovementDto
        {
            OriginalText = originalText,
            ImprovedText = improvedText,
            Notes = "MVP kural tabanli asistan: metin daha acik, davetkar ve fayda odakli hale getirildi."
        });
    }

    private int GetCurrentUserId()
    {
        var rawUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(rawUserId, out var userId) || userId <= 0)
        {
            throw new UnauthorizedAccessException("Gecerli kullanici bulunamadi.");
        }

        return userId;
    }

    private async Task<bool> CanManageEventAsync(int eventId)
    {
        if (User.IsInRole(UserRoles.SystemAdmin))
        {
            return true;
        }

        var userId = GetCurrentUserId();
        var clubId = await _context.Events
            .AsNoTracking()
            .Where(e => e.Id == eventId)
            .Select(e => e.ClubId)
            .FirstOrDefaultAsync();

        if (clubId == 0)
        {
            return false;
        }

        return await _context.ClubRoleAssignments
            .AsNoTracking()
            .AnyAsync(x =>
                x.ClubId == clubId &&
                x.UserId == userId &&
                (x.Role == ClubRoles.President ||
                 x.Role == ClubRoles.VicePresident ||
                 x.Role == ClubRoles.EventManager));
    }

    private async Task<(int UserId, int EventId)?> ResolveNoShowTargetAsync(int? userId, int? eventId)
    {
        if (userId.HasValue && eventId.HasValue)
        {
            if (!await CanManageEventAsync(eventId.Value))
            {
                return null;
            }

            return (userId.Value, eventId.Value);
        }

        var currentUserId = GetCurrentUserId();
        var manageableClubIds = User.IsInRole(UserRoles.SystemAdmin)
            ? await _context.Clubs.AsNoTracking().Select(c => c.Id).ToListAsync()
            : await _context.ClubRoleAssignments
                .AsNoTracking()
                .Where(x =>
                    x.UserId == currentUserId &&
                    (x.Role == ClubRoles.President ||
                     x.Role == ClubRoles.VicePresident ||
                     x.Role == ClubRoles.EventManager))
                .Select(x => x.ClubId)
                .ToListAsync();

        var application = await _context.Applications
            .AsNoTracking()
            .Include(a => a.Event)
            .Where(a =>
                a.Status == ApplicationStatus.Approved &&
                manageableClubIds.Contains(a.Event.ClubId))
            .OrderBy(a => a.Event.EventDate)
            .FirstOrDefaultAsync();

        return application is null ? null : (application.UserId, application.EventId);
    }

    private static ReviewAnalysisItem AnalyzeReview(int reviewId, string comment, int? rating, DateTime createdAt, string eventTitle, string reviewerName)
    {
        var normalized = comment.Trim();
        var riskScore = 0;
        var reasons = new List<string>();

        if (normalized.Length < 12)
        {
            riskScore += 25;
            reasons.Add("Yorum cok kisa oldugu icin inceleme onerildi.");
        }

        var words = normalized.Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        if (words.Length >= 4 && words.GroupBy(w => w.ToLowerInvariant()).Any(g => g.Count() >= 3))
        {
            riskScore += 35;
            reasons.Add("Tekrar eden kelime yapisi algilandi.");
        }

        if (rating is <= 1 or >= 5 && normalized.Length < 25)
        {
            riskScore += 20;
            reasons.Add("Uc puanlama ile kisa yorum birlikte goruldu.");
        }

        var riskLevel = riskScore >= 60 ? "High" : riskScore >= 25 ? "Medium" : "Low";

        return new ReviewAnalysisItem
        {
            ReviewId = reviewId,
            EventTitle = eventTitle,
            ReviewerName = reviewerName,
            Rating = rating ?? 0,
            Comment = comment,
            CreatedAt = createdAt,
            RiskLevel = riskLevel,
            Reason = reasons.Count == 0 ? "Belirgin spam paterni bulunmadi." : string.Join(" ", reasons),
            RiskScore = riskScore
        };
    }

    private sealed class ReviewAnalysisItem
    {
        public int ReviewId { get; set; }
        public string EventTitle { get; set; } = string.Empty;
        public string ReviewerName { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string RiskLevel { get; set; } = "Low";
        public string Reason { get; set; } = string.Empty;
        public int RiskScore { get; set; }
    }
}
