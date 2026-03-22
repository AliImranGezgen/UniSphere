using Microsoft.EntityFrameworkCore;
using UniSphere.Core;
using UniSphere.Core.Interfaces;
using UniSphere.Infrastructure.Data;

namespace UniSphere.Infrastructure.Repositories
{
    // ClubRepository, IClubRepository interfaceinden kalıtım alır.
    public class ClubRepository : IClubRepository
    {
        private readonly AppDbContext _context;

        // Constructor : Database bağlantısını yapıyoruz.
        public ClubRepository(AppDbContext context)
        {
            _context = context;
        }

        // 1. Tüm Kulüpleri Getir
        public async Task<IEnumerable<Club>> GetAllClubAsync()
        {
            // Veritabanındaki Clubs tablosuna git ve hepsini liste olarak getir.
            return await _context.Clubs.ToListAsync();
        }

        // 2. ID'ye Göre Kulüp Getir
        public async Task<Club> GetByIdAsync(int id)
        {
            // Clubs tablosunda bu ID'yi bul.
            return await _context.Clubs.FindAsync(id);
        }

        // 3. Yeni Kulüp Ekle
        public async Task<Club> AddAsync(Club club)
        {
            await _context.Clubs.AddAsync(club); // Masaya koy
            await _context.SaveChangesAsync();     // Veritabanına kalıcı olarak kaydet
            return club;
        }

        // 4. Kulüp Sil
        public async Task DeleteClubAsync(int id)
        {
            var club = await _context.Clubs.FindAsync(id); // Önce silinecek kulübü bul
            if (club != null) // Eğer gerçekten böyle bir kulüp varsa...
            {
                _context.Clubs.Remove(club);       // Masadan kaldır
                await _context.SaveChangesAsync(); // Veritabanından kalıcı olarak sil
            }
        }
    }
}