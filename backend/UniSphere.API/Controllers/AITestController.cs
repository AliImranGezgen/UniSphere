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
        var result = _recommendationService.GetRecommendations(new RecommendationRequestDto
        {
            UserId = 1,
            AppliedEventIds = new List<int> { 1, 3 },
            CheckedInEventIds = new List<int> { 2 },
            InterestedCategories = new List<string> { "tech" }
        });

        return Ok(result);
    }

    [HttpGet("noshow")]
    public IActionResult GetNoShowPrediction()
    {
        var result = _noShowPredictionService.Predict(new NoShowRequestDto
        {
            UserId = 1,
            EventId = 1,
            PreviousNoShowCount = 2,
            PreviousAttendCount = 8
        });

        return Ok(result);
    }
}