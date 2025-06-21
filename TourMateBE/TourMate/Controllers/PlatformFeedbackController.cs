using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.RequestModels;
using Services;

namespace TourMate.Controllers
{
    [Authorize]
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

        /// <summary>
        /// Get all platform feedbacks
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PlatformFeedbackDto>>> GetAllPlatformFeedbacks()
        {
            try
            {
                var feedbacks = await _feedbackService.GetAllPlatformFeedbacksAsync();
                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Get platform feedback by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<PlatformFeedbackDto>> GetPlatformFeedbackById(int id)
        {
            try
            {
                var feedback = await _feedbackService.GetPlatformFeedbackByIdAsync(id);
                if (feedback == null)
                    return NotFound(new { message = "Platform feedback not found" });

                return Ok(feedback);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Get platform feedbacks by rating
        /// </summary>
        [HttpGet("rating/{rating}")]
        public async Task<ActionResult<IEnumerable<PlatformFeedbackDto>>> GetPlatformFeedbacksByRating(int rating)
        {
            try
            {
                if (rating < 1 || rating > 5)
                    return BadRequest(new { message = "Rating must be between 1 and 5" });

                var feedbacks = await _feedbackService.GetPlatformFeedbacksByRatingAsync(rating);
                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Get platform feedback statistics
        /// </summary>
        [HttpGet("stats")]
        public async Task<ActionResult<FeedbackStatsDto>> GetPlatformFeedbackStats()
        {
            try
            {
                var stats = await _feedbackService.GetPlatformFeedbackStatsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }
    }
}
