using System.Threading.Tasks;

namespace UniSphere.Core.Interfaces;

public interface IClubRoleService
{
    // System Admin tarafından bir kulübe başkan atama işlemi
    Task<bool> AssignPresidentAsync(int clubId, int userId);

    // Kulüp başkanı (veya System Admin) tarafından kulüp üyesine rol atama
    Task<bool> AssignRoleAsync(int clubId, int assignerUserId, int targetUserId, string role);

    // Kulüp üyesinin rolünü kaldırma
    Task<bool> RevokeRoleAsync(int clubId, int revokerUserId, int targetUserId, string role);

    // Kullanıcının belirli bir kulüpteki rolünü getirme (Authorization vb. için de faydalıdır)
    Task<string?> GetUserRoleInClubAsync(int clubId, int userId);
}
