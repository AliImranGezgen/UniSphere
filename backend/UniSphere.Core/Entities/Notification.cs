namespace UniSphere.Core.Entities;

// Sistem tarafından kullanıcılara gönderilecek bildirimleri (ör. "Etkinlik başarıyla oluşturuldu") temsil eden entity
public class Notification
{
    public int Id { get; set; }

    // Hangi kullanıcıya ait olduğunu belirten yabancı anahtar (Foreign Key)
    public int UserId { get; set; }

    // Kullanıcı ile bağlantıyı (Navigation Property) sağlayan özellik
    public User User { get; set; } = null!;

    // Bildirimin asıl içeriği/mesajı
    public string Message { get; set; } = string.Empty;

    // 3. Faz: Sistem duyurularını filtrelemek için bildirim tipi (örn. "System")
    public string Type { get; set; } = string.Empty;

    // Kullanıcının bildirimi okuyup okumadığını takip eder (Varsayılan olarak okunamadı)
    public bool IsRead { get; set; } = false;

    // Bildirimin oluşturulma zamanı
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
