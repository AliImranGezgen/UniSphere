using Microsoft.EntityFrameworkCore;
using UniSphere.Core;
using UniSphere.Core.Interfaces;
using UniSphere.Infrastructure.Data;

namespace UniSphere.Infrastructure.Repositories
{
    public class ApplicationRepository : IApplicationRepository
    {
        private readonly AppDbContext _context;

        public ApplicationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ExistsByUserAndEventAsync(int userId, int eventId)
        {
            return await _context.Applications
                .AnyAsync(a => a.UserId == userId && a.EventId == eventId);
        }
        public async Task<bool> HasCheckedInApplicationAsync(int userId, int eventId)
        {
            return await _context.Applications
                .AnyAsync(a => a.UserId == userId &&
                               a.EventId == eventId &&
                               a.CheckedIn == true);
        }

        public async Task<int> GetApprovedCountByEventAsync(int eventId)
        {
            return await _context.Applications
                .CountAsync(a => a.EventId == eventId && a.Status == ApplicationStatus.Approved);
        }

        public async Task<bool> HasCheckedInUsersAsync(int eventId)
        {
            return await _context.Applications
                .AnyAsync(a => a.EventId == eventId && a.CheckedIn == true);
        }

        public async Task<Application> AddAsync(Application application)
        {
            _context.Applications.Add(application);
            await _context.SaveChangesAsync();
            return application;
        }

        public async Task<Application?> GetByUserAndEventAsync(int userId, int eventId)
        {
            return await _context.Applications
                .FirstOrDefaultAsync(a => a.UserId == userId && a.EventId == eventId);
        }

        public async Task UpdateAsync(Application application)
        {
            _context.Applications.Update(application);
            await _context.SaveChangesAsync();
            await _context.SaveChangesAsync();
        }
    }
}