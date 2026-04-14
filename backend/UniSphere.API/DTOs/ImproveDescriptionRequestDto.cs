namespace UniSphere.API.DTOs
{
    /// <summary>
    /// Etkinlik açıklamasını iyileştirmek için API'ye gönderilecek Request nesnesi.
    /// </summary>
    public class ImproveDescriptionRequestDto
    {
        public string TextToImprove { get; set; } = string.Empty;
    }
}
