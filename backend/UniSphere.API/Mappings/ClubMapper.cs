using UniSphere.API.DTOs;
using UniSphere.Core.Entities;

namespace UniSphere.API.Mappings
{
    public static class ClubMapper
    {
        // 1. Frontendden gelen bilgileri entityle gönder.
        public static Club ToEntity(this CreateClubDto dto)
        {
            return new Club
            {
                Name = dto.Name,
                Description = dto.Description,
                Logo = dto.Logo, // 3. Faz: Topluluk vitrini için logo URL'si aktarılır.
                ShortDescription = dto.ShortDescription, // 3. Faz: Vitrin kartı kısa açıklaması aktarılır.
                AboutText = dto.AboutText, // 3. Faz: Profil sayfası hakkında metni aktarılır.
                FoundedYear = dto.FoundedYear, // 3. Faz: Topluluğun kuruluş yılı aktarılır.
                ContactEmail = dto.ContactEmail, // 3. Faz: Profil iletişim e-postası aktarılır.
                SocialLinks = dto.SocialLinks, // 3. Faz: Sosyal medya linkleri aktarılır.
                Website = dto.Website // 3. Faz: Topluluk web sitesi aktarılır.
                // Id'yi ve CreatedAt'i yazmıyoruz çünkü veritabanı ve Entity kendisi halledecek
            };
        }

        // 2. Veritabanınından gelen dosyaları frontedde göster.
        public static ClubResponseDto ToDto(this Club club)
        {
            return new ClubResponseDto
            {
                Id = club.Id,
                Name = club.Name,
                Description = club.Description,
                CreatedAt = club.CreatedAt,
                Logo = club.Logo, // 3. Faz: Topluluk vitrini logo alanı response'a eklenir.
                ShortDescription = club.ShortDescription, // 3. Faz: Kart kısa açıklaması response'a eklenir.
                AboutText = club.AboutText, // 3. Faz: Profil hakkında metni response'a eklenir.
                FoundedYear = club.FoundedYear, // 3. Faz: Kuruluş yılı response'a eklenir.
                ContactEmail = club.ContactEmail, // 3. Faz: İletişim e-postası response'a eklenir.
                SocialLinks = club.SocialLinks, // 3. Faz: Sosyal medya linkleri response'a eklenir.
                Website = club.Website // 3. Faz: Web sitesi response'a eklenir.
            };
        }
    }
}
