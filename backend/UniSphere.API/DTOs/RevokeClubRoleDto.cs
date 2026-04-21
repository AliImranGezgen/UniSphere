using System.ComponentModel.DataAnnotations;

namespace UniSphere.API.DTOs;

public class RevokeClubRoleDto
{
    // Rol kaldırılacak kullanıcının Id'si
    public int UserId { get; set; }

    // Kaldırılacak rol (President, VicePresident, EventManager, vb.)
    [Required]
    public string Role { get; set; } = string.Empty;
}