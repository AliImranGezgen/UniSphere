namespace UniSphere.Core.AI.DTOs;

public class AIResponseMetaDto
{
    public string Model { get; set; } = "rule-based-v1";
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
}
