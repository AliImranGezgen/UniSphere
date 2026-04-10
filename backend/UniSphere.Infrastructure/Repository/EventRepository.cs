using UniSphere.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using UniSphere.Core;
using UniSphere.Infrastructure.Data;

namespace UniSphere.Infrastructure.Repositories
{
    public class EventRepository : IEventRepository
    {
        private readonly AppDbContext _context;

        public EventRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Event>> GetAllEventsAsync()
        {
            return await _context.Events.ToListAsync();
        }

        public async Task<Event?> GetByEventIdAsync(int eventId)
        {
            return await _context.Events.FindAsync(eventId);
        }

        public async Task<Event> AddEventAsync(Event newEvent)
        {
            await _context.AddAsync(newEvent);
            await _context.SaveChangesAsync();
            return newEvent;
        }

        public async Task<Event> UpdateEventAsync(Event updateEvent)
        {
            _context.Events.Update(updateEvent);
            await _context.SaveChangesAsync();
            return updateEvent;
        }

        public async Task DeleteAsync(int eventId)
        {
            var eventCheck = await _context.Events.FindAsync(eventId);
            if (eventCheck != null)
            {
                _context.Events.Remove(eventCheck);
                await _context.SaveChangesAsync();
            }
        }
    }
}
