using System;
namespace UniSphere.API.DTOs
{
    public class ClubResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // 3. Faz: Topluluk profilinde gösterilecek logo URL'si.
        public string Logo { get; set; } = string.Empty;

        // 3. Faz: Topluluk kartlarında kullanılacak kısa açıklama.
        public string ShortDescription { get; set; } = string.Empty;

        // 3. Faz: Topluluk profil sayfasındaki detaylı hakkında metni.
        public string AboutText { get; set; } = string.Empty;

        // 3. Faz: Topluluğun kuruluş yılı.
        public int? FoundedYear { get; set; }

        // 3. Faz: Topluluğun iletişim e-posta adresi.
        public string ContactEmail { get; set; } = string.Empty;

        // 3. Faz: Sosyal medya linkleri için sade string/JSON alanı.
        public string SocialLinks { get; set; } = string.Empty;

        // 3. Faz: Topluluğun web sitesi.
        public string Website { get; set; } = string.Empty;
    }
}
