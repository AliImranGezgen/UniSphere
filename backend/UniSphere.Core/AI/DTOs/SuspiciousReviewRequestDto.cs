namespace UniSphere.Core.AI.DTOs;

// 3. Faz: Şüpheli yorum tespiti için endpoint'e gelen sade request contract'ı.
public class SuspiciousReviewRequestDto
{
    // 3. Faz: Analiz edilecek yorumun id'si.
    public int ReviewId { get; set; }

    // 3. Faz: Analiz edilecek yorum metni.
    public string Comment { get; set; } = string.Empty;
}
