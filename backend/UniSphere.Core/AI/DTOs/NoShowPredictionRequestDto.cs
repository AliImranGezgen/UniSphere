namespace UniSphere.Core.AI.DTOs;

// 3. Faz: No-show tahmini için endpoint'e gelen sade request contract'ı.
public class NoShowPredictionRequestDto
{
    // 3. Faz: No-show tahmini istenen kullanıcının id'si.
    public int UserId { get; set; }

    // 3. Faz: No-show tahmini istenen etkinliğin id'si.
    public int EventId { get; set; }
}
