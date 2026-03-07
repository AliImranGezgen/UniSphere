using UniSphere.Core.DTOs;
using Microsoft.EntityFrameworkCore;
using UniSphere.Core;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;

namespace UniSphere.Core.Services
{
    public class AuthService : IAuthService
    {
        private readonly DbContext _context;

        public AuthService(DbContext context)
        {
            _context = context;
        }

        public async Task<string> RegisterAsync(RegisterDto registerDto)
        {
            var usersTable = _context.Set<User>();

            var userExists = await usersTable
                .AnyAsync(u => u.Email == registerDto.Email || u.Name == registerDto.Username);

            if (userExists)
            {
                throw new Exception("Bu bilgilerle kayıtlı bir kullanıcı zaten mevcut.");
            }

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            var newUser = new User
            {
                Name = registerDto.Username,
                Email = registerDto.Email,
                Password = hashedPassword 
            };

            await usersTable.AddAsync(newUser);
            await _context.SaveChangesAsync();

            return $"Kayıt başarılı: {newUser.Name}";
        }

        public async Task<string> LoginAsync(LoginDto loginDto)
        {
            var usersTable = _context.Set<User>();
            var user = await usersTable.FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            // Kullanıcı yoksa veya şifre yanlışsa hata fırlat
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
            {
                throw new Exception("Hatalı e-posta veya şifre girdiniz.");
            }

            // --- TOKEN ÜRETİMİ ---
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Name)
            };

            // Güvenlik anahtarı (En az 32 karakter olmalı)
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("UniSphere_Cok_Gizli_Key_1234567890_Sifre_Uzun_Olmalidir"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "UniSphereAPI",
                audience: "UniSphereFrontend",
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}