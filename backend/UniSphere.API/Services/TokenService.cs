using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using UniSphere.Core.Entities;

namespace UniSphere.API.Services;

// Kullanıcı için JWT token üreten servis
public class TokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string CreateToken(User user)
    {
        // Token içine koyulacak bilgiler
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var jwtKey = _configuration["Jwt:Key"];
        if (string.IsNullOrWhiteSpace(jwtKey))
        {
            throw new InvalidOperationException("JWT Key is missing. Check Jwt:Key configuration.");
        }

        var keyBytes = Encoding.UTF8.GetBytes(jwtKey);
        if (keyBytes.Length < 16)
        {
            throw new InvalidOperationException("JWT Key must be at least 16 characters for HS256. Check Jwt:Key or Jwt__Key/JWT_KEY environment variables.");
        }

        var key = new SymmetricSecurityKey(keyBytes);

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // Token oluşturma
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                int.Parse(_configuration["Jwt:ExpireMinutes"]!)
            ),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
