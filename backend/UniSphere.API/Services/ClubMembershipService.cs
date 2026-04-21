using Microsoft.EntityFrameworkCore;
using UniSphere.Core.Entities;
using UniSphere.Infrastructure.Data;

namespace UniSphere.API.Services;

// 3. Faz: Kullanıcının topluluğa doğrudan aktif üye olmasını ve üyelikten çıkmasını yöneten servis.
public class ClubMembershipService
{
    private const string ActiveStatus = "Active";
    private readonly AppDbContext _context;

    public ClubMembershipService(AppDbContext context)
    {
        _context = context;
    }

    // 3. Faz: Onay süreci olmadan aktif üyelik kaydı oluşturur veya eski kaydı tekrar aktifleştirir.
    public async Task<ClubMembership> JoinAsync(int clubId, int userId)
    {
        var clubExists = await _context.Clubs.AnyAsync(c => c.Id == clubId);
        if (!clubExists)
            throw new InvalidOperationException("Topluluk bulunamadı.");

        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
            throw new InvalidOperationException("Kullanıcı bulunamadı.");

        var existingMembership = await _context.ClubMemberships
            .FirstOrDefaultAsync(m => m.ClubId == clubId && m.UserId == userId);

        if (existingMembership != null)
        {
            existingMembership.Status = ActiveStatus;
            await _context.SaveChangesAsync();
            return existingMembership;
        }

        var membership = new ClubMembership
        {
            ClubId = clubId,
            UserId = userId,
            Status = ActiveStatus,
            CreatedAt = DateTime.UtcNow
        };

        _context.ClubMemberships.Add(membership);
        await _context.SaveChangesAsync();

        return membership;
    }

    // 3. Faz: Üyeliği silmeden pasifleştirir; tekrar katılımda aynı kayıt Active yapılabilir.
    public async Task<bool> LeaveAsync(int clubId, int userId)
    {
        var membership = await _context.ClubMemberships
            .FirstOrDefaultAsync(m => m.ClubId == clubId && m.UserId == userId && m.Status == ActiveStatus);

        if (membership == null)
            return false;

        membership.Status = "Inactive";
        await _context.SaveChangesAsync();

        return true;
    }
}
