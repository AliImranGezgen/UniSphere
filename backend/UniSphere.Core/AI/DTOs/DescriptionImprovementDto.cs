namespace UniSphere.Core.AI.DTOs;

// 3. Faz: Etkinlik açıklaması iyileştirme endpoint'inin response contract'ı.
public class DescriptionImprovementDto
{
    // 3. Faz: İyileştirme öncesi orijinal etkinlik açıklaması.
    public string OriginalText { get; set; } = string.Empty;

    // 3. Faz: AI modülünün döndüreceği iyileştirilmiş açıklama.
    public string ImprovedText { get; set; } = string.Empty;

    // 3. Faz: Açıklama iyileştirme hakkında kısa notlar.
    public string Notes { get; set; } = string.Empty;
}
