namespace UniSphere.Core.Entities;

// Sistemdeki etkinliklerin entityleri
public class Event
{
    public int Id { get; set; }

    // Etkinliğin başlığı
    public string Title { get; set; } = string.Empty;

    // Katılımcı kapasitesi
    public int Capacity { get; set; }

    // Etkinlik açıklaması
    public string Description { get; set; } = string.Empty;

    // Etkinlik tarihi
    public DateTime EventDate { get; set; }

    // Etkinlik konumu
    public string Location { get; set; } = string.Empty;

    // Etkinlik afiş görseli dosya yolu (opsiyonel)
    public string? PosterImagePath { get; set; }

    // Hangi kulübe ait olduğu
    public int ClubId { get; set; }

    // Etkinlik kategorisi
    public string Category { get; set; } = string.Empty;

    // Kulüp ilişkisi (Navigation Property)
    public Club Club { get; set; } = null!;

    // 🔥 Bu etkinliğe yapılan başvurular
    public ICollection<Application> Applications { get; set; } = new List<Application>();

    // 🔥 Bu etkinlik için bırakılan yorumlar
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}
