namespace UniSphere.API.DTOs
{
    public class UpdateClubDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Logo { get; set; } = string.Empty;
        public string ShortDescription { get; set; } = string.Empty;
        public string AboutText { get; set; } = string.Empty;
        public int? FoundedYear { get; set; }
        public string ContactEmail { get; set; } = string.Empty;
        public string SocialLinks { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;
    }
}
