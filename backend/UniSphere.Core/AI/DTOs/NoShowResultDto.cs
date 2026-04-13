namespace UniSphere.Core.AI.DTOs;

public class NoShowResultDto
{
    // Hesaplanan risk seviyesi (Low, Medium, High).
    public string RiskLevel { get; set; } = string.Empty;

    // Hedef kullanıcının no-show (gelmeme) skoru (0.00 - 100.00 arası).
    public double Score { get; set; }

    // Admin panelinde hedeflenen kullanıcıya ait bu skorun NEDEN verildiğini açıklayan liste.
    public List<string> Reasons { get; set; } = new();

    // Ortak AI response metadata bilgisi.
    public AIResponseMetaDto Meta { get; set; } = new();
}
