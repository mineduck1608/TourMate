using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.DTO.UpdateModels;
using Repositories.Models;
using Repositories.RequestModels;
using Repositories.ResponseModels;
using Services;
using Services.Utils;

namespace API.Controllers
{
    [Route("api/feedback")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackService _feedbackService;
        private readonly ITourGuideService _tourGuideService;
        private readonly IEmailSender _emailSender;

        public FeedbackController(IFeedbackService feedbackService, ITourGuideService tourGuideService, IEmailSender emailSender)
        {
            _feedbackService = feedbackService;
            _tourGuideService = tourGuideService;
            _emailSender = emailSender;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Feedback>> Get(int id)
        {
            return Ok(await _feedbackService.GetFeedback(id));
        }

        [HttpGet("invoice/{id}")]
        public async Task<ActionResult<Feedback>> GetByInvoice(int id)
        {
            return Ok(await _feedbackService.GetFeedbackByInvoice(id));
        }

        [Authorize(Roles = "TourGuide")]
        [HttpGet("tour-guide/account/{id}")]
        public async Task<ActionResult<TourGuideFeedback>> GetByAccountId(int id)
        {
            return Ok(await _feedbackService.GetFeedbackByAccount(id));
        }

        [Authorize(Roles = "Customer")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] FeedbackCreateModel data)
        {
            var feedback = data.Convert();
            var result = await _feedbackService.CreateFeedback(feedback);
            if(result != null)
            {
                var feedbackCreated = await _feedbackService.GetFeedbackContainInvoice(feedback.FeedbackId);
                var mailBody = _feedbackService.GenerateTourGuideFeedbackEmail(feedbackCreated);
                var tourGuideEmail = await _tourGuideService.GetTourGuide(feedback.TourGuideId);
                try
                {
                    await _emailSender.SendEmailAsync(tourGuideEmail.Account.Email, "📅 Bạn có một đánh giá mới từ khách hàng!", mailBody);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Email send failed: {ex.Message}");
                }
                return Ok();
            }
            return BadRequest();
        }

        [Authorize(Roles = "Customer")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromBody] FeedbackUpdateModel data)
        {
            var feedback = await _feedbackService.GetFeedback(data.FeedbackId);
            if(feedback == null)
            {
                return BadRequest();
            }
            feedback.Rating = data.Rating;
            feedback.Content = data.Content;
            feedback.UpdatedAt = DateTime.Now;
            var result = await _feedbackService.UpdateFeedback(feedback);
            if (result == true)
            {
                return Ok();
            }
            return BadRequest();
        }

        [Authorize(Roles = "Customer")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _feedbackService.DeleteFeedback(id);
            return result ? NoContent() : NotFound();
        }

        [HttpGet("tour-guide/public")]
        public async Task<ActionResult> GetTourGuideFeedbacksPublic(
            [FromQuery] int tourGuideId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _feedbackService.GetTourGuideFeedbacksPublicAsync(tourGuideId, page, pageSize);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Có lỗi xảy ra khi lấy danh sách đánh giá", error = ex.Message });
            }
        }

        /// <summary>
        /// Get all tour feedbacks
        /// </summary>
        [HttpGet("tour")]
        public async Task<ActionResult<IEnumerable<TourFeedbackDto>>> GetAllTourFeedbacks()
        {
            try
            {
                var feedbacks = await _feedbackService.GetAllTourFeedbacksAsync();
                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Get tour feedback by ID
        /// </summary>
        [HttpGet("tour/{id}")]
        public async Task<ActionResult<TourFeedbackDto>> GetTourFeedbackById(int id)
        {
            try
            {
                var feedback = await _feedbackService.GetTourFeedbackByIdAsync(id);
                if (feedback == null)
                    return NotFound(new { message = "Tour feedback not found" });

                return Ok(feedback);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Get tour feedbacks by tour guide ID
        /// </summary>
        [HttpGet("tour/tour-guide/{tourGuideId}")]
        public async Task<ActionResult<IEnumerable<TourFeedbackDto>>> GetTourFeedbacksByTourGuideId(int tourGuideId)
        {
            try
            {
                var feedbacks = await _feedbackService.GetTourFeedbacksByTourGuideIdAsync(tourGuideId);
                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Get tour feedbacks by rating
        /// </summary>
        [HttpGet("tour/rating/{rating}")]
        public async Task<ActionResult<IEnumerable<TourFeedbackDto>>> GetTourFeedbacksByRating(int rating)
        {
            try
            {
                if (rating < 1 || rating > 5)
                    return BadRequest(new { message = "Rating must be between 1 and 5" });

                var feedbacks = await _feedbackService.GetTourFeedbacksByRatingAsync(rating);
                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Get tour feedback statistics
        /// </summary>
        [HttpGet("tour/stats")]
        public async Task<ActionResult<FeedbackStatsDto>> GetTourFeedbackStats()
        {
            try
            {
                var stats = await _feedbackService.GetTourFeedbackStatsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Get top tour guides by rating
        /// </summary>
        [HttpGet("tour/top-guides")]
        public async Task<ActionResult<IEnumerable<TopTourGuideDto>>> GetTopTourGuides([FromQuery] int limit = 10)
        {
            try
            {
                var topGuides = await _feedbackService.GetTopTourGuidesAsync(limit);
                return Ok(topGuides);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

    }
}