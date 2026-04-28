using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using UniSphere.Core.Entities;
using UniSphere.Core.Interfaces;
using UniSphere.Infrastructure.Data;

namespace UniSphere.Infrastructure.Services;

public class ClubRoleService : IClubRoleService
{
    private readonly AppDbContext _context;

    public ClubRoleService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> AssignPresidentAsync(int clubId, int userId)
    {
        // Kulübün ve kullanıcının varlığını kontrol et
        var club = await _context.Clubs.FindAsync(clubId);
        var user = await _context.Users.FindAsync(userId);

        if (club == null || user == null)
            return false;

        // Mevcut başkanı bul
        var currentPresident = await _context.ClubRoleAssignments
            .FirstOrDefaultAsync(cra => cra.ClubId == clubId && cra.Role == ClubRoles.President);

        // Eğer mevcut başkan varsa ve aynı kişiyse işlem yapma
        if (currentPresident != null)
        {
            if (currentPresident.UserId == userId)
                return true;
            
            // Eğer farklı kişiyse, eski başkanı üye konumuna çekebiliriz (Veya silebiliriz. Biz burada siliyoruz)
            _context.ClubRoleAssignments.Remove(currentPresident);
        }

        // Kullanıcının başka rolü varsa sil/güncelle ki Unique constraint patlamasın (Bir kulüpte sadece 1 rolü olabilir)
        var existingRole = await _context.ClubRoleAssignments
            .FirstOrDefaultAsync(cra => cra.ClubId == clubId && cra.UserId == userId);

        if (existingRole != null)
        {
            _context.ClubRoleAssignments.Remove(existingRole);
        }

        // Yeni başkanı ekle
        var newPresidentAssignment = new ClubRoleAssignment
        {
            ClubId = clubId,
            UserId = userId,
            Role = ClubRoles.President,
            AssignedAt = DateTime.UtcNow
        };

        await _context.ClubRoleAssignments.AddAsync(newPresidentAssignment);
        
        // İsteğe bağlı olarak Club entity'sinin ManagerId propertisini de geriye dönük uyumluluk için güncelleyebiliriz
        club.ManagerId = userId;
        _context.Clubs.Update(club);

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> AssignRoleAsync(int clubId, int assignerUserId, int targetUserId, string role)
    {
        // Atayan kişinin rolünü doğrulamamız gerekiyor mu? Servis bazında ekstra kontrol. 
        // (Bunu genelde Authorization policy de yapar ancak servis katmanında da güvenceye almak best-practice)
        var assignerRole = await GetUserRoleInClubAsync(clubId, assignerUserId);
        
        // System admin'in atladığını varsaysak bile DB'de SystemAdmin kaydı ClubRoleAssignment'da yoktur
        // Dolayısıyla System Admin kontrolünü Controller'da / Policy'de yapacağımızı varsayarak,
        // burada basitçe assigner'ın en azından 'President' olup olmadığına da bakabiliriz (veya yetkili mi).
        // Eğer assignerRole President değilse işlem durur.
        // Not: System Admin kullanıcısının Role string'i User.Role == "SystemAdmin" olur. Servise inject etmek için
        // AppDbContext kullanarak kullanıcı ana entity'sini de kontrol edebiliriz.
        var assignerUser = await _context.Users.FindAsync(assignerUserId);
        if (assignerUser?.Role != UserRoles.SystemAdmin && assignerRole != ClubRoles.President)
        {
            throw new UnauthorizedAccessException("Bu atamayı yapmak için kulüp başkanı olmalısınız.");
        }

        // Başkanlık rolünü sadece System Admin atayabilir (AssignPresidentAsync kullanılması gerekir).
        // Bu yüzden eğer President rolü atanmaya çalışılıyorsa engelliyoruz.
        if (role == ClubRoles.President)
        {
            throw new InvalidOperationException("Başkan atamaları özel metoda (AssignPresident) tabidir.");
        }

        // Eski rolü varsa kontrol et
        var existingRole = await _context.ClubRoleAssignments
            .FirstOrDefaultAsync(cra => cra.ClubId == clubId && cra.UserId == targetUserId && cra.Role == role);
            
        if (existingRole != null)
        {
            // Kullanıcı zaten aynı roldeyse başarılı dön
            return true;
        }

        var newAssignment = new ClubRoleAssignment
        {
            ClubId = clubId,
            UserId = targetUserId,
            Role = role,
            AssignedAt = DateTime.UtcNow
        };

        await _context.ClubRoleAssignments.AddAsync(newAssignment);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> RevokeRoleAsync(int clubId, int revokerUserId, int targetUserId, string role)
    {
        var revokerUser = await _context.Users.FindAsync(revokerUserId);
        var revokerRole = await GetUserRoleInClubAsync(clubId, revokerUserId);

        // Yine authorization kontrolü
        if (revokerUser?.Role != UserRoles.SystemAdmin && revokerRole != ClubRoles.President)
        {
            throw new UnauthorizedAccessException("Rol silme işlemi için kulüp başkanı olmalısınız.");
        }

        var targetRole = await _context.ClubRoleAssignments
            .FirstOrDefaultAsync(cra => cra.ClubId == clubId && cra.UserId == targetUserId && cra.Role == role);

        if (targetRole == null)
            return false;

        // Başkan kendi kendini silemez (Sadece System Admin silebilir/değiştirebilir diyelim)
        if (targetRole.Role == ClubRoles.President && revokerUser?.Role != UserRoles.SystemAdmin)
        {
            throw new InvalidOperationException("Kulüp başkanının rolü sadece System Admin tarafından düşürülebilir.");
        }

        _context.ClubRoleAssignments.Remove(targetRole);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<string?> GetUserRoleInClubAsync(int clubId, int userId)
    {
        var assignment = await _context.ClubRoleAssignments
            .AsNoTracking() // Sadece okuma yapıyoruz, track etmeye gerek yok
            .FirstOrDefaultAsync(cra => cra.ClubId == clubId && cra.UserId == userId);

        return assignment?.Role;
    }
    public async Task<IEnumerable<ClubRoleAssignment>> GetClubRoleAssignmentsAsync(int clubId)
    {
        return await _context.ClubRoleAssignments
            .AsNoTracking()
            .Where(cra => cra.ClubId == clubId)
            .Include(cra => cra.User)
            .OrderBy(cra => cra.Role == ClubRoles.President ? 0 : 1)
            .ThenBy(cra => cra.User.Name)
            .ToListAsync();
    }
}
