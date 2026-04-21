using UniSphere.API.DTOs;
using UniSphere.Core.Entities; // Event entity'sinin olduğu yer

namespace UniSphere.API.Mappings
{
    public static class EventMapping
    {
        // 1. Entity'den DTO'ya Çeviri (Veritabanından Frontend'e giderken)
        public static EventResponseDto ToDto(this Event eventModel, string baseUrl = "")
        {
            return new EventResponseDto
            {
                EventId    = eventModel.Id,
                Title      = eventModel.Name, // 3. Faz: Name olarak güncellendi
                Capacity   = eventModel.MaxParticipants, // 3. Faz: MaxParticipants olarak güncellendi
                Description = eventModel.Description,
                // DateTime → ISO 8601 string ("yyyy-MM-ddTHH:mm:ss")
                EventDate  = eventModel.EventDate.ToString("yyyy-MM-ddTHH:mm:ss"),
                Location   = "N/A", // Eski Location kaldırıldı, placeholder
                Category   = eventModel.Category, // 3. Faz: Category eklendi
                ClubId     = eventModel.ClubId,
                ClubName   = eventModel.Club?.Name ?? string.Empty,
                // Poster URL'i: dosya yolu varsa tam URL oluştur
                PosterImageUrl = string.IsNullOrEmpty(eventModel.PosterUrl)
                    ? null
                    : $"{baseUrl}/uploads/{eventModel.PosterUrl}"
            };
        }

        // 2. DTO'dan Entity'ye Çeviri (Frontend'den Veritabanına gelirken)
        // Dosya kaydetme işlemi Controller'da yapılır; posterPath parametresi oradan gelir.
        public static Event ToEntity(this CreateEventDto createDto, string? posterPath = null)
        {
            return new Event
            {
                Name       = createDto.Title, // 3. Faz: Name olarak
                MaxParticipants    = createDto.Capacity, // 3. Faz: MaxParticipants olarak
                Description = createDto.Description,
                // String → DateTime parse (desteklenen formatlar: ISO 8601, "dd.MM.yyyy HH:mm")
                Date   = ParseEventDate(createDto.EventDate).ToString("yyyy-MM-dd"), // 3. Faz: Date string
                Time   = ParseEventDate(createDto.EventDate).ToString("HH:mm"), // 3. Faz: Time string
                ClubId      = createDto.ClubId,
                PosterUrl = posterPath, // 3. Faz: PosterUrl olarak
                Category = createDto.Category ?? string.Empty // 3. Faz: Category eklendi
            };
        }

        // Ortak tarih parse yardımcısı
        public static DateTime ParseEventDate(string dateStr)
        {
            // Önce kültür-bağımsız ISO 8601 dene, sonra Türkçe formatı dene
            if (DateTime.TryParse(dateStr, System.Globalization.CultureInfo.InvariantCulture,
                    System.Globalization.DateTimeStyles.None, out var parsed))
                return parsed;

            // "dd.MM.yyyy HH:mm" formatı
            if (DateTime.TryParseExact(dateStr, "dd.MM.yyyy HH:mm",
                    System.Globalization.CultureInfo.InvariantCulture,
                    System.Globalization.DateTimeStyles.None, out parsed))
                return parsed;

            throw new ArgumentException($"Geçersiz tarih formatı: '{dateStr}'. Beklenen format: 'yyyy-MM-ddTHH:mm' veya 'dd.MM.yyyy HH:mm'");
        }
    }
}