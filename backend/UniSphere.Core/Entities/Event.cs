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
}