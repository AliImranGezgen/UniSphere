namespace UniSphere.Core.Entities;

// Sistemdeki kullanıcıyı temsil eden entity
public class User
{
    // Kullanıcının benzersiz kimliği (Primary Key)
    public int Id { get; set; }

    // Kullanıcının görünen adı
    public string Name { get; set; } = string.Empty;

    // Kullanıcının email adresi
    public string Email { get; set; } = string.Empty;

    // Kullanıcının şifresinin hashlenmiş hali (plaintext şifre tutulmaz)
    public string PasswordHash { get; set; } = string.Empty;

    // Kullanıcının sistem içindeki rolü (User, Admin vb.)
    public string Role { get; set; } = UserRoles.Student;

    // Kullanıcının sisteme kayıt olduğu tarih
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    // Kullanıcının etkinliklere yaptığı başvurular
    public ICollection<Application> Applications { get; set; } = new List<Application>();

    // Kullanıcının etkinliklere bıraktığı yorumlar
    public ICollection<Review> Reviews { get; set; } = new List<Review>();

    // Kullanıcıya ait bildirimlerin listesi (Bire Çok İlişki)
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    // Kullanıcının kulüplerdeki yetkilendirme listesi (Başkan, Üye vb.)
    public ICollection<ClubRoleAssignment> ClubRoles { get; set; } = new List<ClubRoleAssignment>();
}