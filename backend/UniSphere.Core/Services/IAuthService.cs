using UniSphere.Core.DTOs;

namespace UniSphere.Core.Services
{
    // Baştaki "I" harfi bunun bir Interface (Sözleşme) olduğunu belirtir
    public interface IAuthService
    {
        // 1. Madde: Bana RegisterDto kutusu ver, sana sonuç mesajı döneyim (Kayıt Ol)
        Task<string> RegisterAsync(RegisterDto registerDto);

        // 2. Madde: Bana LoginDto kutusu ver, sana kimlik kartı (Token) döneyim (Giriş Yap)
        Task<string> LoginAsync(LoginDto loginDto);
    }
}