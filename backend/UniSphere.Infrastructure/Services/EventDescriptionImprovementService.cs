using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using UniSphere.Core.AI;
using UniSphere.Core.Interfaces;

namespace UniSphere.Infrastructure.Services
{
    /// <summary>
    /// Etkinlik açıklamalarını AI kullanarak analiz eden ve iyileştirilmiş bir versiyonunu
    /// uygun JSON formatıyla dönen servis entegrasyon sınıfı.
    /// </summary>
    public class EventDescriptionImprovementService : IEventDescriptionImprovementService
    {
        // 1. AI System Prompt Tasarımı:
        // LLM (OpenAI, Gemini vb.) modeline istek atarken kullanılacak kesin komutlar.
        private const string SystemPrompt = @"
Rolün: Sen kıdemli bir editör ve üniversite etkinlik yönetimi uzmanısın.
Görevin: Sana verilecek olan öğrenci/kulüp etkinliği açıklamalarını analiz edip, daha profesyonel, akıcı ve hatasız bir metin haline getirmektir.

Düzeltme Odakları:
- İmla ve yazım hataları.
- Noktalama işaretleri.
- Anlatım bozuklukları.
- Okunabilirlik (Readability) ve profesyonel ton.

KESİNLİKLE VE YALNIZCA AŞAĞIDAKİ JSON FORMATINDA YANIT VERMELİSİN. HİÇBİR EK METİN, SELAMLAMA VEYA MARKDOWN KOD BLOĞU (```json) KULLANMA.

JSON Output Schema:
{
  ""originalText"": ""(Kullanıcının girdiği ham metin aynen buraya yansıtılmalı)"",
  ""improvedText"": ""(AI tarafından yukarıdaki odaklara dikkat edilerek düzeltilmiş profesyonel metin)"",
  ""explanations"": [
    ""(Hangi kısmı neden düzelttiğine dair kısa ve öz açıklama - 1)"",
    ""(Hangi kısmı neden düzelttiğine dair kısa ve öz açıklama - 2)""
  ]
}";

        public async Task<EventDescriptionImprovementResult> ImproveDescriptionAsync(string originalText)
        {
            // TODO: Gerçek AI API entegrasyonu (HttpClient veya AI SDK) buraya eklenecektir.
            // Örnek: var requestMsg = new { role = "system", content = SystemPrompt } vb.
            
            // 2. JSON Output Formatı Uyarınca Dönecek Yapının Simülasyonu.
            // AI servisinden parse edilmiş veriyi temsil eden Dummy Objemiz:
            var simulatedAIResult = new EventDescriptionImprovementResult
            {
                OriginalText = originalText,
                ImprovedText = "Bu metin, etkinliklerinizi çok daha kurumsal bir dille ifade etmeniz için AI tarafından düzenlenmiştir. (Örnek Düzeltilmiş Metin)",
                Explanations = new List<string> 
                { 
                    "Cümle başlarındaki büyük/küçük harf hataları giderildi.",
                    "Metnin akıcılığını bozduğu için tekrar eden bağlaçlar çıkarıldı.",
                    "Topluluk etkinlikleri için daha uygun, profesyonel bir üslup yapılandırıldı."
                }
            };

            // Senkron çalışır gibi beklemeyi simüle edelim
            await Task.Delay(500);

            return simulatedAIResult;
        }
    }
}
