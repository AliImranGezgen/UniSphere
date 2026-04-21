using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization; // Bunu eklemeyi unutma (Yetkilendirme için)
using UniSphere.API.DTOs;
using UniSphere.API.Mappings;
using UniSphere.Core.Interfaces;

namespace UniSphere.API.Controllers
{
    [ApiController] // API kontrolcüsü.
    [Route("api/[controller]")] // Adresi: domain.com/api/clubs
    public class ClubsController : ControllerBase
    {
        private readonly IClubRepository _repository;
        private readonly IClubRoleService _clubRoleService; // 1. YENİ SERVİSİMİZİ EKLEDİK

        // Constructor'ı güncelledik
        public ClubsController(IClubRepository repository, IClubRoleService clubRoleService)
        {
            _repository = repository;
            _clubRoleService = clubRoleService; // Servisi eşledik
        }

        // GÖREV 1: Tüm Kulüpleri Listele (GET api/clubs)
        [HttpGet]
        public async Task<IActionResult> GetAllClub()
        {
            var entities = await _repository.GetAllClubAsync();
            var dtos = entities.Select(x => x.ToDto());
            return Ok(dtos);
        }

        // GÖREV 2: Yeni Kulüp Oluştur (POST api/clubs)
        [HttpPost]
        [Authorize(Roles = "SystemAdmin")] // 2. KİLİT EKLENDİ: Sadece Admin kulüp açabilir!
        public async Task<IActionResult> Create([FromBody] CreateClubDto dto)
        {
            // İlgili DTO'yu Entity'ye çevirip veritabanına ekliyoruz.
            var club = new UniSphere.Core.Entities.Club
            {
                Name = dto.Name,
                Description = dto.Description,
                CreatedAt = DateTime.UtcNow
            };
            
            await _repository.AddAsync(club);
            
            return Ok(new { message = "Kulüp başarıyla oluşturuldu.", clubId = club.Id }); 
        }

        // GÖREV 3: Başkan Atama (POST api/clubs/{clubId}/assign-president)
        [HttpPost("{clubId}/assign-president")]
        [Authorize(Roles = "SystemAdmin")] // KİLİT: Sadece Admin başkan atayabilir!
        public async Task<IActionResult> AssignPresident(int clubId, [FromBody] AssignPresidentDto dto)
        {
            var result = await _clubRoleService.AssignPresidentAsync(clubId, dto.UserId);
            
            if (!result)
                return BadRequest(new { message = "Başkan ataması başarısız. Kullanıcı veya kulüp bulunamadı." });

            return Ok(new { message = "Başkan başarıyla atandı." });
        }

        // GÖREV 4: Rol Atama / Ekip Yetkilendirme (POST api/clubs/{clubId}/assign-role)
        [HttpPost("{clubId}/assign-role")]
        [Authorize(Policy = "MustBeClubPresident")] // YENİ: if yazmak yerine Özel Policy (MustBeClubPresident) kullanıyoruz. 
        public async Task<IActionResult> AssignRole(int clubId, [FromBody] AssignClubRoleDto dto)
        {
            try
            {
                // İstek atan kişinin (Assigner) ID'sini Token'dan alıyoruz
                var assignerUserId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");

                // Policy sayesinde buraya giren kullanıcının kulüp başkanı (veya SystemAdmin) olduğu KESİN.
                // Serviste tekrar kontrol yapmaya gerek kalmadan işlemi güvenle devam ettiriyoruz.
                await _clubRoleService.AssignRoleAsync(clubId, assignerUserId, dto.UserId, dto.Role);
                return Ok(new { message = $"{dto.Role} rolü başarıyla atandı." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GÖREV 5: Rol Silme (POST veya DELETE api/clubs/{clubId}/revoke-role/{userId})
        [HttpDelete("{clubId}/revoke-role/{userId}")]
        [Authorize(Policy = "MustBeClubPresident")] // Sadece başkan veya admin yetkili silebilir.
        public async Task<IActionResult> RevokeRole(int clubId, int userId)
        {
            try
            {
                var revokerUserId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
                
                await _clubRoleService.RevokeRoleAsync(clubId, revokerUserId, userId);
                return Ok(new { message = "Rol başarıyla kaldırıldı." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}