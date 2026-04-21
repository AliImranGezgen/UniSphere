namespace UniSphere.Core.Entities;

// Sistemdeki etkinliklerin entityleri
public class Event
{
    public int Id { get; set; }

    // Etkinliğin başlığı
    public string Name { get; set; } = string.Empty; // Migration'da Name, ama Title olarak kullanılmış, düzeltelim Name

    // Katılımcı kapasitesi
    public int MaxParticipants { get; set; } // Migration'da MaxParticipants

    // Etkinlik açıklaması
    public string Description { get; set; } = string.Empty;

    // Etkinlik tarihi (string olarak tutuluyor)
    public string Date { get; set; } = string.Empty;

    // Etkinlik saati (string)
    public string Time { get; set; } = string.Empty;

    // Etkinlik afiş görseli URL'si
    public string PosterUrl { get; set; } = string.Empty;

    // Hangi kulübe ait olduğu
    public int ClubId { get; set; }

    // Kulüp ilişkisi (Navigation Property)
    public Club Club { get; set; } = null!;

    // 🔥 Bu etkinliğe yapılan başvurular
    public ICollection<Application> Applications { get; set; } = new List<Application>();

    // 🔥 Bu etkinlik için bırakılan yorumlar
    public ICollection<Review> Reviews { get; set; } = new List<Review>();

    // 3. Faz: Etkinlik kategorisi (technical, social, vb.)
    public string Category { get; set; } = string.Empty;

    // Computed property: Date ve Time'den EventDate oluştur (servislerde kullanım için)
    public DateTime EventDate => DateTime.TryParse($"{Date} {Time}", out var dt) ? dt : DateTime.MinValue;
}
