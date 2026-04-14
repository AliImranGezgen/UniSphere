using System.Collections.Generic;

namespace UniSphere.API.DTOs
{
    /// <summary>
    /// AI tarafından düzeltilmiş metin sonucunu REST API'den Client'a dönecek Response nesnesi.
    /// </summary>
    public class ImproveDescriptionResponseDto
    {
        public string OriginalText { get; set; } = string.Empty;
        public string ImprovedText { get; set; } = string.Empty;
        public List<string> Explanations { get; set; } = new List<string>();
    }
}
