using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Services;

namespace TourMate.Controllers
{
    [Route("api/platform-feedback")]
    [ApiController]
    public class PlatformFeedbackController : ControllerBase
    {
        private IPlatformFeedbackService _feedbackService;

        public PlatformFeedbackController(IPlatformFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PlatformFeedbackCreateModel data)
        {
            var feedback = data.Convert();
            var result = await _feedbackService.CreatePlatformFeedback(feedback);
            if (result == true)
            {
                return Ok();
            }
            return BadRequest();
        }
    }
}
