namespace UniSphere.Core.AI.DTOs;

public class NoShowResultDto
{
    public string RiskLevel { get; set; } = string.Empty;
    public double Score { get; set; }

    // Ortak AI response metadata bilgisi.
    public AIResponseMetaDto Meta { get; set; } = new();
}
