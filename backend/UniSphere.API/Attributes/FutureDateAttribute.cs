using System.ComponentModel.DataAnnotations;

namespace UniSphere.API.Attributes;

// [FutureDate] olarak kullanılacak olan özel (custom) doğrulama (validation) sınıfımız.
// Bu attribute, sadece gelecekteki tarihlerin sisteme girilmesine izin verir.
public class FutureDateAttribute : ValidationAttribute
{
    // IsValid metodunu ezerek (override) kendi doğrulama mantığımızı yazıyoruz.
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        // Gelen veri bir DateTime objesi mi diye kontrol edilir.
        if (value is DateTime date)
        {
            // Eğer tarih şu anki zamandan gerideyse hata fırlatırız (Geçmiş tarihli etkinlik oluşturulamaz).
            if (date.ToUniversalTime() < DateTime.UtcNow)
            {
                return new ValidationResult("Etkinlik tarihi geçmiş bir tarih olamaz. Lütfen ileri bir tarih seçiniz.");
            }
        }

        // Eğer bir sorun yoksa başarılı döneriz.
        return ValidationResult.Success;
    }
}
