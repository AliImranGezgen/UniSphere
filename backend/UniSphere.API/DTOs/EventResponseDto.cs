namespace UniSphere.API.DTOs
{
    public class EventResponseDto
    {
        public int EventId { get; set; }
        public string Title { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public string Description { get; set; } = string.Empty;
        // EventDate string olarak döndürülüyor (ISO 8601 format)
        public string EventDate { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty; // 3. Faz: Kategori eklendi
        public int ClubId { get; set; }
        public string ClubName { get; set; } = null!;
        // Afiş görseli URL'i (null ise afiş yok)
        public string? PosterImageUrl { get; set; }
    }
}