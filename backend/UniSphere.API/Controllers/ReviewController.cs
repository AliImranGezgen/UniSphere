using Microsoft.AspNetCore.Mvc;
using UniSphere.API.DTOs;
using UniSphere.API.Services;

namespace UniSphere.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController : ControllerBase
    {
        private readonly ReviewService _reviewService;

        public ReviewController(ReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpPost]
        public async Task<IActionResult> Submit(int eventId, int userId, CreateReviewDto dto)
        {
            try
            {
                var result = await _reviewService.SubmitReviewAsync(eventId, userId, dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}