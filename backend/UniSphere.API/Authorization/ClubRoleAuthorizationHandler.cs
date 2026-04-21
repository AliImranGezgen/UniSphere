using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using UniSphere.Core.Entities;
using UniSphere.Core.Interfaces;

namespace UniSphere.API.Authorization;

public class ClubRoleAuthorizationHandler : AuthorizationHandler<ClubRoleRequirement>
{
    private readonly IClubRoleService _clubRoleService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ClubRoleAuthorizationHandler(
        IClubRoleService clubRoleService, 
        IHttpContextAccessor httpContextAccessor)
    {
        _clubRoleService = clubRoleService;
        _httpContextAccessor = httpContextAccessor;
    }

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context, 
        ClubRoleRequirement requirement)
    {
        var user = context.User;

        // Kullanıcı giriş yapmamışsa fail.
        if (user.Identity == null || !user.Identity.IsAuthenticated)
        {
            return; // Yetki yok
        }

        // Global System Admin ise her halükarda yetkilidir.
        var userRoleClaim = user.FindFirst(ClaimTypes.Role)?.Value;
        if (userRoleClaim == UserRoles.SystemAdmin)
        {
            context.Succeed(requirement);
            return;
        }

        // İstek yapılan URL'den (Route) clubId parametresini al
        var httpContext = _httpContextAccessor.HttpContext;
        var routeValues = httpContext?.Request.RouteValues;

        if (routeValues == null || !routeValues.TryGetValue("clubId", out var clubIdObj))
        {
            // Eğer clubId yoksa bu policy bu endpoint için anlamsız olabilir
            return;
        }

        if (!int.TryParse(clubIdObj?.ToString(), out int clubId))
        {
            return;
        }

        // Token'dan userId'yi al
        var nameIdentifierClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(nameIdentifierClaim, out int userId))
        {
            return;
        }

        // Veritabanından (Servis üzerinden) kullanıcının bu kulüpteki rolünü çek
        var clubRole = await _clubRoleService.GetUserRoleInClubAsync(clubId, userId);

        // Eğer rolü varsa ve policy'nin izin verdiği rollerden biriyle uyuşuyorsa başarıya ulaşır
        if (!string.IsNullOrEmpty(clubRole) && requirement.AllowedRoles.Contains(clubRole))
        {
            context.Succeed(requirement);
        }
    }
}
