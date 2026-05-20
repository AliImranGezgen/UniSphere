using UniSphere.Core.AI.DTOs;

namespace UniSphere.Core.AI.Interfaces;

public interface IRecommendationService
{
    Task<List<RecommendationResultDto>> GetRecommendationsAsync(RecommendationRequestDto request);
}
