namespace UniSphere.Core;

//Sistemdeki etkinliklerine entitiyleri
public class Event
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime EventDate { get; set; }
    public string Location { get; set; } = string.Empty;
    public int ClubId { get; set; }
    public Club Club { get; set; } = null!;

    // Navigation properties
    // Etkinliğe yapılan tüm başvurular
    public ICollection<Application> Applications { get; set; } = new List<Application>();
    
    // Etkinliğe bırakılan tüm yorumlar
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}