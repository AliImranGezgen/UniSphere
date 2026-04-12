using Microsoft.AspNetCore.Mvc;
using UniSphere.API.DTOs;
using UniSphere.API.Services;
namespace UniSphere.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventController : ControllerBase
    {
        private readonly EventService _eventService;

        public EventController(EventService eventService)
        {
            _eventService = eventService;
        }

        // GÖREV 1 : Tüm etkinlikleri listele
        [HttpGet]
        public async Task<IActionResult> GetAllEvents()
        {
            var events = await _eventService.GetAllEventsAsync();
            return Ok(events);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateEventDto dto, int userId)
        {
            try
            {
                // 1. İş kurallarını servis katmanında çalıştır
                var createdEvent = await _eventService.CreateEventAsync(dto, userId);

                // 2. İşlem başarılı olduysa, oluşturulan yeni etkinliği geri dön
                return Ok(createdEvent);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GÖREV 3 : Tek bir etkinliği getir
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var eventDto = await _eventService.GetByIdAsync(id);

            // Eğer veritabanında böyle bir ID yoksa 404 (Bulunamadı) dön
            if (eventDto == null)
                return NotFound("Aradığınız etkinlik bulunamadı.");

            return Ok(eventDto);
        }

        // GÖREV 4 : Etkinliği Güncelle
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, EventUpdateDto dto, int userId)
        {
            try
            {
                // Güncelleme işlemini servis katmanına bırakıyoruz
                var updatedEvent = await _eventService.UpdateEventAsync(id, dto, userId);

                if (updatedEvent == null)
                    return NotFound("Güncellenecek etkinlik bulunamadı.");

                return Ok(updatedEvent);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GÖREV 5 : Etkinliği Sil
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, int userId)
        {
            try
            {
                // Silme işlemini ve kuralları servis katmanına bırakıyoruz
                var deleted = await _eventService.DeleteEventAsync(id, userId);

                if (!deleted)
                    return NotFound("Silinecek etkinlik zaten yok.");

                // 204 No Content: "İşlem başarıyla yapıldı."
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}