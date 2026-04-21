namespace UniSphere.Core.AI.DTOs;

// 3. Faz: Şüpheli yorum tespit endpoint'inin response contract'ı.
public class SuspiciousReviewDto
{
    // 3. Faz: Şüpheli yorum analizi yapılan yorumun id'si.
    public int ReviewId { get; set; }

    // 3. Faz: Yorum risk seviyesini Low, Medium veya High olarak taşır.
    public string RiskLevel { get; set; } = string.Empty;

    // 3. Faz: Yorumun neden riskli/risk düşük sayıldığını açıklar.
    public string Reason { get; set; } = string.Empty;
}
