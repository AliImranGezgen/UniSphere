using Microsoft.EntityFrameworkCore;
using UniSphere.Core;
using UniSphere.Core.Interfaces;
using UniSphere.Infrastructure.Data;

namespace UniSphere.Infrastructure.Repositories
{
    public class ClubRepository : IClubRepository
    {
        private readonly AppDbContext _context;

        public ClubRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Club>> GetAllClubAsync()
        {
            return await _context.Clubs.ToListAsync();
        }

        public async Task DeleteClubAsync(int id)
        {
            var club = await _context.Clubs.FindAsync(id);
            if (club != null)
            {
                _context.Clubs.Remove(club);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Club?> GetByIdAsync(int id)
        {
            return await _context.Clubs.FindAsync(id);
        }

        public async Task<Club> AddAsync(Club club)
        {
            _context.Clubs.Add(club);
            await _context.SaveChangesAsync();
            return club;
        }
    }
}