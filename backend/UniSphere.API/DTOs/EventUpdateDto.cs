namespace UniSphere.API.DTOs
{
    public class EventUpdateDto
    {
        public int EventId { get; set; }
        public string Title { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public string Description { get; set; } = string.Empty;
        // Tarih string olarak alınıyor, Controller parse eder
        public string EventDate { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public int ClubId { get; set; }
        public string ClubName { get; set; } = null!;
        public IFormFile? PosterImage { get; set; }
    }
}