namespace UniSphere.Core.AI.DTOs;

// 3. Faz: Açıklama iyileştirme için endpoint'e gelen sade request contract'ı.
public class DescriptionImprovementRequestDto
{
    // 3. Faz: İyileştirilmesi istenen ham etkinlik açıklaması.
    public string OriginalText { get; set; } = string.Empty;
}
