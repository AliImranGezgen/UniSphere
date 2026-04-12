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
                var createdEvent = await _eventService.CreateEventAsync(dto, userId);
                return Ok(createdEvent);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var eventDto = await _eventService.GetByIdAsync(id);

            if (eventDto == null)
                return NotFound("Aradığınız etkinlik bulunamadı.");

            return Ok(eventDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, EventUpdateDto dto, int userId)
        {
            try
            {
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, int userId)
        {
            try
            {
                var deleted = await _eventService.DeleteEventAsync(id, userId);

                if (!deleted)
                    return NotFound("Silinecek etkinlik zaten yok.");

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}