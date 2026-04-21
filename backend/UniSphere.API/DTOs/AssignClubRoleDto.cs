using System.ComponentModel.DataAnnotations;

namespace UniSphere.API.DTOs;

public class AssignClubRoleDto
{
    // Rol atanacak kullanıcının Id'si
    public int UserId { get; set; }

    // Atanacak rol (President, VicePresident, EventManager, vb.)
    [Required]
    public string Role { get; set; } = string.Empty;
}
