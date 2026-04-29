using Microsoft.AspNetCore.Mvc;
using UniSphere.Core.AI.DTOs;
using UniSphere.Core.AI.Interfaces;

[ApiController]
[Route("api/ai")]
public class AITestController : ControllerBase
{
    private readonly IRecommendationService _recommendationService;
    private readonly INoShowPredictionService _noShowPredictionService;

    public AITestController(
        IRecommendationService recommendationService,
        INoShowPredictionService noShowPredictionService)
    {
        _recommendationService = recommendationService;
        _noShowPredictionService = noShowPredictionService;
    }

    [HttpGet("recommend")]
    public IActionResult GetRecommendations()
    {
        // Örnek bir request ile recommendation servisini test ediyoruz.
        var result = _recommendationService.GetRecommendations(new RecommendationRequestDto
        {
            UserId = 1,
            AppliedEventIds = new List<int> { 1, 3 },
            CheckedInEventIds = new List<int> { 2 },
            InterestedCategories = new List<string> { "tech" }
        });

        return Ok(result);
    }

    // 3. Faz: Kullanıcıya etkinlik önerileri dönen mock recommendation contract endpoint'i.
    [HttpGet("recommend-events/{userId}")]
    public IActionResult RecommendEvents(int userId)
    {
        var recommendations = new List<EventRecommendationDto>
        {
            new()
            {
                EventId = 1,
                Score = 0.92,
                Reason = $"Kullanıcı {userId} için teknoloji ilgisine göre önerildi."
            },
            new()
            {
                EventId = 2,
                Score = 0.81,
                Reason = "Benzer öğrencilerin başvurduğu popüler etkinlik."
            }
        };

        return Ok(recommendations);
    }

    [HttpGet("noshow")]
    public IActionResult GetNoShowPrediction()
    {
        // Örnek bir request ile no-show tahmin servisini test ediyoruz.
        var result = _noShowPredictionService.Predict(new NoShowRequestDto
        {
            UserId = 1,
            EventId = 1,
            PreviousNoShowCount = 2,
            PreviousAttendCount = 8
        });

        return Ok(result);
    }

    // 3. Faz: Kulüp panelinde liste görünümü için no-show risk contract endpoint'i.
    [HttpGet("no-show-risks")]
    public IActionResult GetNoShowRisks()
    {
        var risks = new[]
        {
            new
            {
                UserId = 1,
                EventId = 1,
                StudentName = "Öğrenci #1",
                EventTitle = "AI ve Gelecek Zirvesi",
                RiskLevel = "Medium",
                RiskScore = 0.57,
                Reason = "Geçmiş katılım örüntüsüne göre orta seviye no-show riski."
            },
            new
            {
                UserId = 2,
                EventId = 1,
                StudentName = "Öğrenci #2",
                EventTitle = "AI ve Gelecek Zirvesi",
                RiskLevel = "Low",
                RiskScore = 0.22,
                Reason = "Son etkinliklerde düzenli check-in davranışı var."
            },
            new
            {
                UserId = 3,
                EventId = 2,
                StudentName = "Öğrenci #3",
                EventTitle = "Kariyer Atölyesi",
                RiskLevel = "High",
                RiskScore = 0.81,
                Reason = "Onaylanmış son etkinliklerde check-in yapılmamış."
            }
        };

        return Ok(risks);
    }

    // 3. Faz: No-show risk tahmini için mock contract endpoint'i.
    [HttpPost("predict-noshow")]
    public IActionResult PredictNoShow([FromBody] NoShowPredictionRequestDto request)
    {
        var response = new NoShowPredictionDto
        {
            UserId = request.UserId,
            EventId = request.EventId,
            RiskLevel = "Medium",
            RiskScore = 0.57,
            Reason = "Geçmiş katılım örüntüsüne göre orta seviye no-show riski."
        };

        return Ok(response);
    }

    // 3. Faz: Şüpheli yorum tespiti için mock contract endpoint'i.
    [HttpPost("detect-suspicious-review")]
    public IActionResult DetectSuspiciousReview([FromBody] SuspiciousReviewRequestDto request)
    {
        var response = new SuspiciousReviewDto
        {
            ReviewId = request.ReviewId,
            RiskLevel = string.IsNullOrWhiteSpace(request.Comment) ? "Low" : "Medium",
            Reason = "Mock analiz: yorum içeriği basit risk kontrolünden geçirildi."
        };

        return Ok(response);
    }

    // 3. Faz: Sistem admin moderasyon ekranını besleyen şüpheli yorum contract endpoint'i.
    [HttpGet("suspicious-reviews")]
    public IActionResult GetSuspiciousReviews()
    {
        var reviews = new[]
        {
            new
            {
                ReviewId = 1,
                EventTitle = "AI ve Gelecek Zirvesi",
                ReviewerName = "Öğrenci #1",
                Rating = 1,
                Comment = "Aynı yorum aynı yorum aynı yorum",
                CreatedAt = DateTime.UtcNow.AddHours(-2),
                RiskLevel = "Medium",
                Reason = "Tekrar eden ifade yapısı nedeniyle inceleme önerildi."
            },
            new
            {
                ReviewId = 2,
                EventTitle = "Kariyer Atölyesi",
                ReviewerName = "Öğrenci #2",
                Rating = 5,
                Comment = "Kısa ve belirsiz yorum",
                CreatedAt = DateTime.UtcNow.AddHours(-1),
                RiskLevel = "Low",
                Reason = "Düşük riskli, ancak yorum içeriği kısa olduğu için listelendi."
            }
        };

        return Ok(reviews);
    }

    // 3. Faz: Etkinlik açıklaması iyileştirme için mock contract endpoint'i.
    [HttpPost("improve-description")]
    public IActionResult ImproveDescription([FromBody] DescriptionImprovementRequestDto request)
    {
        var originalText = request.OriginalText ?? string.Empty;
        var improvedText = string.IsNullOrWhiteSpace(originalText)
            ? "Etkinliğin amacı, kapsamı ve katılımcılara sağlayacağı faydalar net şekilde açıklanmalıdır."
            : $"{originalText.Trim()} Katılımcılar etkinlik sonunda konuya dair uygulanabilir kazanımlar elde edecektir.";

        var response = new DescriptionImprovementDto
        {
            OriginalText = originalText,
            ImprovedText = improvedText,
            Notes = "Mock iyileştirme: metin daha davetkar ve bilgilendirici hale getirildi."
        };

        return Ok(response);
    }
}
