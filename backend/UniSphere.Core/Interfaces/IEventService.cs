using UniSphere.API.DTOs;

namespace UniSphere.Core.Interfaces
{
    public interface IEventService
    {
        Task<IEnumerable<EventDto>> GetAllEventsAsync();
        Task<EventDto?> GetByIdAsync(int id);
        Task<EventDto> CreateEventAsync(CreateEventDto dto);
        Task<EventDto?> UpdateEventAsync(int id, EventUpdateDto dto);
        Task<bool> DeleteEventAsync(int id);
    }
}