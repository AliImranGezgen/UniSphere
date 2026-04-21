namespace UniSphere.Core.Entities;

// Bir kullanıcının bir kulüpteki rol yetkilendirmesini temsil eden varlık
public class ClubRoleAssignment
{
    public int Id { get; set; }

    public int ClubId { get; set; }
    // İlgili kulüp referansı
    public Club Club { get; set; } = null!;

    public int UserId { get; set; }
    // İlgili kullanıcı referansı
    public User User { get; set; } = null!;

    // Kullanıcının kulüp içerisindeki rolü (President, EventManager vb.)
    public string Role { get; set; } = string.Empty;

    // Rolün ne zaman atandığını tutar
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
}
