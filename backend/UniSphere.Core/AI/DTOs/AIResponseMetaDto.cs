namespace UniSphere.Core.AI.DTOs;

public class AIResponseMetaDto
{
    public string Model { get; set; } = "rule-based-v1";
    public string Version { get; set; } = "v1";
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    public bool IsDecisionSupportOnly { get; set; } = true;
}
