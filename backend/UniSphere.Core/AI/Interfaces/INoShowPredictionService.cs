using UniSphere.Core.AI.DTOs;

namespace UniSphere.Core.AI.Interfaces;

public interface INoShowPredictionService
{
    NoShowResultDto Predict(NoShowRequestDto request);
}
