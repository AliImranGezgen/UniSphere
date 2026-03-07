using Microsoft.AspNetCore.Mvc;
using UniSphere.Core.DTOs;
using UniSphere.Core.Services;

namespace UniSphere.API.Controllers
{
    // Bu veznenin adresi: http://localhost:port/api/auth olacak
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        // Veznedarın kullanacağı fabrikayı (IAuthService) tanımlıyoruz
        private readonly IAuthService _authService;

        // Dependency Injection (Bağımlılık Enjeksiyonu): 
        // Sistem çalışırken veznedara "Al bu senin fabrikan" diyerek veriyoruz.
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // --- 1. KAYIT OLMA İSTEĞİNİ KARŞILAYAN KAPI (Endpoint) ---
        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            // DTO'daki güvenlik kurallarımızı (min 8 karakter, geçerli email vb.) kontrol et
            if (!ModelState.IsValid)
            {
                // Eğer kurallara uymazsa, müşteriye 400 Bad Request (Kötü İstek) ve hataları dön
                return BadRequest(ModelState);
            }

            // Her şey doğruysa kutuyu al ve fabrikaya (AuthService) gönder
            var result = await _authService.RegisterAsync(registerDto);
            
            // Başarılı cevabını (200 OK) ve sonucu müşteriye geri ver
            return Ok(new { Message = result });
        }

        // --- 2. GİRİŞ YAPMA İSTEĞİNİ KARŞILAYAN KAPI (Endpoint) ---
        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            // Yine giriş bilgilerinin formatını kontrol et
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Bilgileri fabrikaya gönder ve üretilen Kimlik Kartını (Token) al
            var token = await _authService.LoginAsync(loginDto);
            
            // Üretilen Token'ı React tarafına (Frontend'e) gönder
            return Ok(new { Token = token });
        }
    }
}