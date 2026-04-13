namespace UniSphere.Core.AI.DTOs;

public class NoShowResultDto
{
    public string RiskLevel { get; set; } = string.Empty;
    public double Score { get; set; }
    public AIResponseMetaDto Meta { get; set; } = new();
}
