using UniSphere.Core;
using System.Threading.Tasks;

namespace UniSphere.Core.Interfaces
{
    public interface IEventRepository
    {
        Task<IEnumerable<Event>> GetAllEventsAsync();
        Task<Event?> GetByEventIdAsync(int eventId);
        Task<Event> AddEventAsync(Event newEvent);
        Task<Event> UpdateEventAsync(Event updateEvent);
        Task DeleteAsync(int eventId);
    }
}