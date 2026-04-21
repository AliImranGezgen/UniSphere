namespace UniSphere.Core.AI.DTOs;

// 3. Faz: No-show tahmin endpoint'inin response contract'ı.
public class NoShowPredictionDto
{
    // 3. Faz: No-show riski hesaplanan kullanıcının id'si.
    public int UserId { get; set; }

    // 3. Faz: No-show riski hesaplanan etkinliğin id'si.
    public int EventId { get; set; }

    // 3. Faz: Risk seviyesini Low, Medium veya High olarak taşır.
    public string RiskLevel { get; set; } = string.Empty;

    // 3. Faz: Risk skorunu 0-1 aralığında temsil eder.
    public double RiskScore { get; set; }

    // 3. Faz: Risk skorunun kısa açıklamasını taşır.
    public string Reason { get; set; } = string.Empty;
}
