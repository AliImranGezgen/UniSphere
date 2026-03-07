using System.ComponentModel.DataAnnotations;

namespace UniSphere.Core.DTOs
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "Kullanıcı adı zorunludur.")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email zorunludur.")]
        [EmailAddress(ErrorMessage = "Geçerli bir email formatı giriniz.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Şifre zorunludur.")]
        [MinLength(8, ErrorMessage = "Şifre en az 8 karakter olmalıdır.")]
        public string Password { get; set; } = string.Empty;
    }
}