using Microsoft.AspNetCore.Authorization;

namespace UniSphere.API.Authorization;

public class ClubRoleRequirement : IAuthorizationRequirement
{
    // Bu requirement (gereklilik) hangi rolleri kabul edecek?
    // Örnek: "President", "EventManager" vb.
    public string[] AllowedRoles { get; }

    public ClubRoleRequirement(params string[] allowedRoles)
    {
        AllowedRoles = allowedRoles;
    }
}
