namespace UniSphere.Core.AI.DTOs;

// 3. Faz: Etkinlik öneri endpoint'inin dış contract'ı.
public class EventRecommendationDto
{
    // 3. Faz: Önerilen etkinliğin id'si.
    public int EventId { get; set; }

    // 3. Faz: Öneri skorunu 0-1 aralığında temsil eder.
    public double Score { get; set; }

    // 3. Faz: Önerinin kullanıcıya neden gösterildiğini açıklar.
    public string Reason { get; set; } = string.Empty;
}
