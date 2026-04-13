namespace UniSphere.Core.AI.DTOs;

public class RecommendationResultDto
{
    public int EventId { get; set; }
    public double Score { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string RiskLevel { get; set; } = string.Empty;

    // AI response metadata bilgisi.
    public AIResponseMetaDto Meta { get; set; } = new();
}