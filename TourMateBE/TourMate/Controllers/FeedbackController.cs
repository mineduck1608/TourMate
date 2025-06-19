using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.DTO.UpdateModels;
using Repositories.Models;
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

        [HttpGet]
        public ActionResult<IEnumerable<Feedback>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(_feedbackService.GetAll(pageSize, pageIndex));
        }

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

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _feedbackService.DeleteFeedback(id);
            return result ? NoContent() : NotFound();
        }
    }
}