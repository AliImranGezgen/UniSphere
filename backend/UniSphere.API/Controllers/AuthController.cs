using Microsoft.AspNetCore.Mvc;
using UniSphere.API.Services;
using UniSphere.API.DTOs;
using UniSphere.Infrastructure.Data;
using UniSphere.Core;
using Microsoft.AspNetCore.Authorization;
using BCrypt.Net;
using System.Security.Claims;

namespace UniSphere.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly TokenService _tokenService;
    private readonly AppDbContext _context;

    public AuthController(TokenService tokenService, AppDbContext context)
    {
        _tokenService = tokenService;
        _context = context;
    }

    // REGISTER
    [HttpPost("register")]
    public IActionResult Register(RegisterDto dto)
    {
        // email daha önce kayıtlı mı kontrol et
        if (_context.Users.Any(u => u.Email == dto.Email))
        {
            return BadRequest("Bu e-posta adresi zaten kayıtlı");
        }

        // password hash
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = passwordHash,
            Role = UserRoles.Student,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        _context.SaveChanges();

        return Ok("Kullanıcı başarıyla oluşturuldu");
    }

    // LOGIN
    [HttpPost("login")]
    public IActionResult Login(LoginDto dto)
    {
        var user = _context.Users.FirstOrDefault(u => u.Email == dto.Email);

        if (user == null)
        {
            return Unauthorized("E-posta veya şifre hatalı");
        }

        // password doğrulama
        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

        if (!isPasswordValid)
        {
            return Unauthorized("E-posta veya şifre hatalı");
        }

        var token = _tokenService.CreateToken(user);

        return Ok(new
        {
            token = token
        });
    }

    // LOGIN olan herkes erişebilir
    [Authorize]
    [HttpGet("profile")]
    public IActionResult Profile()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out var userId))
        {
            return Unauthorized();
        }

        var user = _context.Users.FirstOrDefault(u => u.Id == userId);
        if (user == null)
        {
            return NotFound("Kullanıcı bulunamadı.");
        }

        return Ok(new
        {
            user.Id,
            user.Name,
            user.Email,
            user.Role,
            user.CreatedAt
        });
    }

    // SADECE ADMIN erişebilir
    [Authorize(Roles = UserRoles.SystemAdmin)]
    [HttpGet("admin")]
    public IActionResult Admin()
    {
        return Ok("Yönetici yetkisi ile erişildi");
    }
}