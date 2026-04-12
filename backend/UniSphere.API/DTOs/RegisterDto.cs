namespace UniSphere.API.DTOs;

// Register isteği için kullanılan veri modeli
public class RegisterDto
{
    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;
}