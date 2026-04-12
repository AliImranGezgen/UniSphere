using Microsoft.AspNetCore.Mvc;
using UniSphere.API.Services;

namespace UniSphere.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationController : ControllerBase
    {
        private readonly ApplicationService _applicationService;

        public ApplicationController(ApplicationService applicationService)
        {
            _applicationService = applicationService;
        }

        // Etkinliğe başvuru
        [HttpPost("apply")]
        public async Task<IActionResult> Apply(int eventId, int userId)
        {
            try
            {
                var result = await _applicationService.ApplyToEventAsync(eventId, userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Başvuruyu iptal et
        [HttpPut("cancel")]
        public async Task<IActionResult> Cancel(int eventId, int userId)
        {
            try
            {
                await _applicationService.CancelApplicationAsync(eventId, userId);
                return Ok("Başvuru iptal edildi.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}