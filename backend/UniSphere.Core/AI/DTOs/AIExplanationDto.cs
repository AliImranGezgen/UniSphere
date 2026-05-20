namespace UniSphere.Core.AI.DTOs;

public class AIExplanationDto
{
    public string Code { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public double? Weight { get; set; }
}
