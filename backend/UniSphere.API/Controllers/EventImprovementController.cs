using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using UniSphere.API.DTOs;
using UniSphere.Core.Interfaces;

namespace UniSphere.API.Controllers
{
    [ApiController]
    [Route("api/ai/improve-description")]
    public class EventImprovementController : ControllerBase
    {
        private readonly IEventDescriptionImprovementService _improvementService;

        public EventImprovementController(IEventDescriptionImprovementService improvementService)
        {
            _improvementService = improvementService;
        }

        /// <summary>
        /// Kullanıcının etkinlik açıklamasını yapay zeka ile iyileştirmek için API endpoint'i.
        /// </summary>
        /// <param name="request">İçerisinde düzeltilecek metni barındıran DTO</param>
        /// <returns>Düzeltilmiş metin ve açıklamaların yer aldığı nesne</returns>
        [HttpPost]
        public async Task<IActionResult> ImproveDescription([FromBody] ImproveDescriptionRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request?.TextToImprove))
            {
                return BadRequest("İyileştirilecek metin boş olamaz.");
            }

            // Core/Infrastructure içerisinde yer alan servisi çağırarak metni işliyoruz.
            var result = await _improvementService.ImproveDescriptionAsync(request.TextToImprove);

            // Gelen sonucu Client'a döneceğimiz DTO modeline dönüştürüyoruz.
            var response = new ImproveDescriptionResponseDto
            {
                OriginalText = result.OriginalText,
                ImprovedText = result.ImprovedText,
                Explanations = result.Explanations
            };

            return Ok(response);
        }
    }
}
