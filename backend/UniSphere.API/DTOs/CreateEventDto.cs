using System.ComponentModel.DataAnnotations;
using UniSphere.Core.Entities;

namespace UniSphere.API.DTOs
{
    // Etkinlik oluşturma sırasında sunucuya gelen verilerin doğruluğunu sağlayan model
    // multipart/form-data olarak alınır (afiş görseli yüklemek için)
    public class CreateEventDto
    {
        // Etkinlik başlığının boş girilmesini ve 100 karakteri aşmasını engelliyoruz.
        [Required(ErrorMessage = "Etkinlik başlığı zorunludur.")]
        [MaxLength(100, ErrorMessage = "Etkinlik başlığı 100 karakterden uzun olamaz.")]
        public string Title { get; set; } = string.Empty;

        // Etkinlik kapasitesinin 0 veya negatif değer girilmesini (ör. -5 kişi) engeller.
        [Range(1, int.MaxValue, ErrorMessage = "Etkinlik kapasitesi en az 1 kişi olmalıdır.")]
        public int Capacity { get; set; }

        // Etkinlik detaylarının 500 karakteri geçmemesini sağlıyoruz, database şişmesini önler.
        [Required(ErrorMessage = "Açıklama alanı zorunludur.")]
        [MaxLength(500, ErrorMessage = "Açıklama 500 karakterden uzun olamaz.")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mekan/Lokasyon boş bırakılamaz.")]
        public string Location { get; set; } = string.Empty;

        // Hangi kulubün bu etkinliği düzenlediğini belirten anahtar.
        [Required(ErrorMessage = "Kulüp bilgisi zorunludur.")]
        public int ClubId { get; set; }

        // EventDate artık string olarak alınıyor. Format: "yyyy-MM-ddTHH:mm" veya "yyyy-MM-dd HH:mm"
        // Controller bu string'i DateTime'a parse eder, böylece dışarıdan kolay veri girilebilir.
        [Required(ErrorMessage = "Etkinlik tarihi zorunludur.")]
        public string EventDate { get; set; } = string.Empty;

        // Opsiyonel afiş görseli (IFormFile - multipart/form-data)
        public IFormFile? PosterImage { get; set; }
    }
}