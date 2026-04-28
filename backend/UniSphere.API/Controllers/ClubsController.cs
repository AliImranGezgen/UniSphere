using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization; // Bunu eklemeyi unutma (Yetkilendirme için)
using System.Security.Claims;
using UniSphere.API.DTOs;
using UniSphere.API.Mappings;
using UniSphere.API.Services;
using UniSphere.Core.Interfaces;

namespace UniSphere.API.Controllers
{
    [ApiController] // API kontrolcüsü.
    [Route("api/[controller]")] // Adresi: domain.com/api/clubs
    public class ClubsController : ControllerBase
    {
        private readonly IClubRepository _repository;
        private readonly IClubRoleService _clubRoleService; // 1. YENİ SERVİSİMİZİ EKLEDİK
        private readonly ClubMembershipService _clubMembershipService; // 3. Faz: Topluluk üyeliği işlemleri için servis

        // Constructor'ı güncelledik
        public ClubsController(
            IClubRepository repository,
            IClubRoleService clubRoleService,
            ClubMembershipService clubMembershipService)
        {
            _repository = repository;
            _clubRoleService = clubRoleService; // Servisi eşledik
            _clubMembershipService = clubMembershipService; // 3. Faz: Üyelik servisini eşledik
        }

        // GÖREV 1: Tüm Kulüpleri Listele (GET api/clubs)
        [HttpGet]
        public async Task<IActionResult> GetAllClub()
        {
            var entities = await _repository.GetAllClubAsync();
            var dtos = entities.Select(x => x.ToDto());
            return Ok(dtos);
        }

        [HttpGet("{clubId:int}")]
        public async Task<IActionResult> GetClubById(int clubId)
        {
            var club = await _repository.GetByIdAsync(clubId);

            if (club == null)
                return NotFound(new { message = "Kulüp bulunamadı." });

            return Ok(club.ToDto());
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
                Logo = dto.Logo, // 3. Faz: Topluluk vitrini logo alanı kaydedilir.
                ShortDescription = dto.ShortDescription, // 3. Faz: Kısa açıklama kaydedilir.
                AboutText = dto.AboutText, // 3. Faz: Profil hakkında metni kaydedilir.
                FoundedYear = dto.FoundedYear, // 3. Faz: Kuruluş yılı kaydedilir.
                ContactEmail = dto.ContactEmail, // 3. Faz: İletişim e-postası kaydedilir.
                SocialLinks = dto.SocialLinks, // 3. Faz: Sosyal medya linkleri kaydedilir.
                Website = dto.Website, // 3. Faz: Web sitesi kaydedilir.
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

        [HttpPut("{clubId:int}")]
        [Authorize(Policy = "MustBeClubPresident")]
        public async Task<IActionResult> UpdateClub(int clubId, [FromBody] UpdateClubDto dto)
        {
            var club = await _repository.GetByIdAsync(clubId);

            if (club == null)
                return NotFound(new { message = "Kulüp bulunamadı." });

            club.Name = dto.Name;
            club.Description = dto.Description;
            club.Logo = dto.Logo;
            club.ShortDescription = dto.ShortDescription;
            club.AboutText = dto.AboutText;
            club.FoundedYear = dto.FoundedYear;
            club.ContactEmail = dto.ContactEmail;
            club.SocialLinks = dto.SocialLinks;
            club.Website = dto.Website;

            await _repository.UpdateAsync(club);

            return Ok(club.ToDto());
        }

        // 3. Faz: Kullanıcı topluluğa onaysız ve doğrudan aktif üye olur (POST api/clubs/{clubId}/join)
        [HttpPost("{clubId}/join")]
        [Authorize]
        public async Task<IActionResult> JoinClub(int clubId)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var membership = await _clubMembershipService.JoinAsync(clubId, userId);

                return Ok(new ClubMembershipResponseDto
                {
                    ClubId = membership.ClubId,
                    UserId = membership.UserId,
                    Status = membership.Status,
                    Message = "Topluluğa başarıyla katıldınız."
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // 3. Faz: Kullanıcı aktif topluluk üyeliğinden ayrılır (DELETE api/clubs/{clubId}/leave)
        [HttpDelete("{clubId}/leave")]
        [Authorize]
        public async Task<IActionResult> LeaveClub(int clubId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var result = await _clubMembershipService.LeaveAsync(clubId, userId);

            if (!result)
                return NotFound(new { message = "Aktif üyelik bulunamadı." });

            return Ok(new ClubMembershipResponseDto
            {
                ClubId = clubId,
                UserId = userId,
                Status = "Inactive",
                Message = "Topluluk üyeliğinden başarıyla ayrıldınız."
            });
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

        [HttpGet("{clubId:int}/roles")]
        [Authorize(Policy = "MustBeClubPresident")]
        public async Task<IActionResult> GetClubRoles(int clubId)
        {
            var roles = await _clubRoleService.GetClubRoleAssignmentsAsync(clubId);
            var result = roles.Select(role => new ClubRoleAssignmentResponseDto
            {
                ClubId = role.ClubId,
                UserId = role.UserId,
                UserName = role.User?.Name ?? string.Empty,
                UserEmail = role.User?.Email ?? string.Empty,
                Role = role.Role,
                AssignedAt = role.AssignedAt
            });

            return Ok(result);
        }

        // GÖREV 5: Rol Silme (POST veya DELETE api/clubs/{clubId}/revoke-role/{userId})
        [HttpDelete("{clubId}/revoke-role")]
        [Authorize(Policy = "MustBeClubPresident")] // Sadece başkan veya admin yetkili silebilir.
        public async Task<IActionResult> RevokeRole(int clubId, [FromBody] RevokeClubRoleDto dto)
        {
            try
            {
                var revokerUserId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
                
                await _clubRoleService.RevokeRoleAsync(clubId, revokerUserId, dto.UserId, dto.Role);
                return Ok(new { message = $"{dto.Role} rolü başarıyla kaldırıldı." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
