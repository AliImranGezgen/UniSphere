using Microsoft.AspNetCore.Mvc;
using UniSphere.API.DTOs;

using UniSphere.API.Mappings;
using UniSphere.Core.Interfaces;


namespace UniSphere.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventController : ControllerBase
    {
        private readonly IEventRepository _repository;

        public EventController(IEventRepository repository)
        {
            _repository = repository;
        }

        //GÖREV 1 : Tüm etkinlikleri listele
        [HttpGet]
        public async Task<IActionResult> GetAllEvents()
        {
            var entities = await _repository.GetAllEventsAsync();
            var dtos = entities.Select(x => x.ToDto());
            return Ok(dtos);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateEventDto dto)
        {
            // 1. Gelen DTO'yu veritabanının anlayacağı Entity formatına çevir
            var eventEntity = dto.ToEntity();

            // 2. Repository aracılığıyla veritabanına kaydet
            var createdEvent = await _repository.AddEventAsync(eventEntity);

            // 3. İşlem başarılı olduysa, oluşturulan yeni etkinliği DTO'ya çevirip 200 OK ile geri dön
            return Ok(createdEvent.ToDto());
        }

        // GÖREV 3 : Tek bir etkinliği getir
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var entity = await _repository.GetByEventIdAsync(id);

            // Eğer veritabanında böyle bir ID yoksa 404 (Bulunamadı) dön
            if (entity == null)
                return NotFound("Aradığınız etkinlik bulunamadı.");

            return Ok(entity.ToDto());
        }

        // GÖREV 4 : Etkinliği Güncelle
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, EventUpdateDto dto)
        {
            // Güvenlik: Adresteki ID ile gönderilen paketteki ID aynı mı?
            if (id != dto.EventId)
                return BadRequest("URL'deki ID ile DTO içindeki ID uyuşmuyor!");

            // Veritabanında gerçekten böyle bir etkinlik var mı diye kontrol et
            var existingEvent = await _repository.GetByEventIdAsync(id);
            if (existingEvent == null)
                return NotFound("Güncellenecek etkinlik bulunamadı.");

            // Kilerdeki malzemenin (Entity) üzerine, müşteriden gelen yeni bilgileri (DTO) yazıyoruz
            existingEvent.Title = dto.Title;
            existingEvent.Description = dto.Description;
            existingEvent.EventDate = dto.EventDate;
            existingEvent.Location = dto.Location;
            existingEvent.Capacity = dto.Capacity;
            existingEvent.ClubId = dto.ClubId;

            // Yamağa (Repository) kaydetmesini söylüyoruz
            await _repository.UpdateEventAsync(existingEvent);

            // Güncellenmiş halini müşteriye geri dönüyoruz
            return Ok(existingEvent.ToDto());
        }

        // GÖREV 5 : Etkinliği Sil
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            // Silmeden önce böyle bir etkinlik var mı diye bakıyoruz
            var existingEvent = await _repository.GetByEventIdAsync(id);
            if (existingEvent == null)
                return NotFound("Silinecek etkinlik zaten yok.");

            await _repository.DeleteAsync(id);

            // 204 No Content: "İşlem başarıyla yapıldı.".
            return NoContent();

        }
    }
}