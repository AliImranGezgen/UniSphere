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
                Description = dto.Description
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
                CreatedAt = club.CreatedAt
            };
        }
    }
}