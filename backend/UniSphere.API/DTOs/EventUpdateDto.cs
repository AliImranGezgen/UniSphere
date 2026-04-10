namespace UniSphere.API.DTOs
{
    public class EventUpdateDto
    {
        public int EventId { get; set; }
        public string Title { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime EventDate { get; set; }
        public string Location { get; set; } = string.Empty;
        public int ClubId { get; set; }
        public string ClubName { get; set; } = null!;
    }
}