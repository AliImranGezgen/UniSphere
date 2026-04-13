using UniSphere.Core.AI.DTOs;

namespace UniSphere.Core.AI.Interfaces;

public interface IRecommendationService
{
    List<RecommendationResultDto> GetRecommendations(RecommendationRequestDto request);
}