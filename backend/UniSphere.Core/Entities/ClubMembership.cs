namespace UniSphere.Core.Entities;

// Kullanıcının topluluğa üyeliğini temsil eden entity
public class ClubMembership
{
    public int Id { get; set; }

    public int UserId { get; set; }
    // İlgili kullanıcı referansı
    public User User { get; set; } = null!;

    public int ClubId { get; set; }
    // İlgili kulüp referansı
    public Club Club { get; set; } = null!;

    // Üyelik durumu (örneğin: "Active", "Pending", "Inactive")
    public string Status { get; set; } = "Active"; // Sade çözüm: doğrudan aktif

    // Üyeliğin oluşturulma tarihi
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}