using Microsoft.EntityFrameworkCore;
using UniSphere.Core;
using UniSphere.Core.Entities;
using UniSphere.Core.Interfaces;
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
            return await _context.Events
                .Include(e => e.Club)
                .ToListAsync();
        }

        public async Task<Event?> GetByEventIdAsync(int eventId)
        {
            return await _context.Events
                .Include(e => e.Club)
                .FirstOrDefaultAsync(e => e.Id == eventId);
        }

        public async Task<Event> AddEventAsync(Event eventEntity)
        {
            _context.Events.Add(eventEntity);
            await _context.SaveChangesAsync();
            return eventEntity;
        }

        public async Task<Event> UpdateEventAsync(Event eventEntity)
        {
            _context.Events.Update(eventEntity);
            await _context.SaveChangesAsync();
            return eventEntity;
        }

        public async Task DeleteAsync(int eventId)
        {
            var eventEntity = await _context.Events.FindAsync(eventId);
            if (eventEntity != null)
            {
                _context.Events.Remove(eventEntity);
                await _context.SaveChangesAsync();
            }
        }
    }
}