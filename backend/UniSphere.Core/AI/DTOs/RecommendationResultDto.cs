namespace UniSphere.Core.AI.DTOs;

public class RecommendationResultDto
{
    public int EventId { get; set; }
    public string EventTitle { get; set; } = string.Empty;
    public string ClubName { get; set; } = string.Empty;
    public double Score { get; set; }
    public string Reason { get; set; } = string.Empty;
    public List<AIExplanationDto> Explanations { get; set; } = new();
    public AIResponseMetaDto Meta { get; set; } = new();
}
