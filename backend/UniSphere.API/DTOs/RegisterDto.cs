using System.ComponentModel.DataAnnotations;

namespace UniSphere.API.DTOs;

// Kayıt (Register) işlemi sırasında dışarıdan alınan veriyi taşıyan ve doğrulayan model
public class RegisterDto
{
    // Sistemin güvenliği ve veri bütünlüğü için isim alanının boş geçilmesini engelliyoruz.
    [Required(ErrorMessage = "İsim alanı zorunludur.")]
    public string Name { get; set; } = string.Empty;

    // Geçerli bir e-posta adresi olup olmadığını EmailAddress attribute'u ile kontrol ediyoruz.
    [Required(ErrorMessage = "E-posta adresi alanı zorunludur.")]
    [EmailAddress(ErrorMessage = "Lütfen geçerli bir e-posta adresi giriniz.")]
    public string Email { get; set; } = string.Empty;

    // Şifrenin en az 6 karakter olmasını zorunlu tutarak güvenliği artırıyoruz.
    [Required(ErrorMessage = "Şifre alanı zorunludur.")]
    [MinLength(6, ErrorMessage = "Şifreniz en az 6 karakter uzunluğunda olmalıdır.")]
    public string Password { get; set; } = string.Empty;
}