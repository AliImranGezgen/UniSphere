namespace UniSphere.Core.AI.DTOs;

public class AIResponseMetaDto
{
    // Hangi model veya sürüm tarafından üretildiğini belirtir.
    public string Model { get; set; } = "rule-based-v1";

    // Yanıtın üretildiği zamanı UTC olarak saklar.
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
}
