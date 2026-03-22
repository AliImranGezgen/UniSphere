using Microsoft.AspNetCore.Mvc;
using UniSphere.API.DTOs;
using UniSphere.API.Mappings;
using UniSphere.Core.Interfaces;


namespace UniSphere.API.Controllers
{
    [ApiController] // Bu bir API kontrolcüsüdür
    [Route("api/[controller]")] // Adresi: domain.com/api/clubs
    public class ClubsController : ControllerBase
    {
        private readonly IClubRepository _repository;

        // Constructor: Garsona "Git şu depoyla (repository) çalış" diyoruz.
        public ClubsController(IClubRepository repository)
        {
            _repository = repository;
        }

        // GÖREV 1: Tüm Kulüpleri Listele (GET api/clubs)
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var entities = await _repository.GetAllClubAsync(); // Depodan ham veriyi al
            var dtos = entities.Select(x => x.ToDto()); // Aşçıya (Mapper) tabaklat
            return Ok(dtos); // Müşteriye 200 OK ile sun
        }

        // GÖREV 2: Yeni Kulüp Oluştur (POST api/clubs)
        [HttpPost]
        public async Task<IActionResult> Create(CreateClubDto dto)
        {
            var entity = dto.ToEntity(); // Müşterinin siparişini ham malzemeye çevir
            var createdEntity = await _repository.AddAsync(entity); // Depoya kaydet
            return Ok(createdEntity.ToDto()); // Kaydedilen haliyle geri sun
        }
    }
}