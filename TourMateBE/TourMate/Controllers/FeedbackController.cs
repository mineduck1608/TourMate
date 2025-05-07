using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/feedbacks")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackService _feedbackService;

        public FeedbackController(IFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        [HttpGet("{id}")]
        public ActionResult<Feedback> Get(int id)
        {
            return Ok(_feedbackService.GetFeedback(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<Feedback>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(_feedbackService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public IActionResult Create([FromBody] FeedbackCreateModel data)
        {
            var feedback = data.Convert();
            _feedbackService.CreateFeedback(feedback);
            return CreatedAtAction(nameof(Get), new { id = feedback.FeedbackId }, feedback);
        }

        [HttpPut]
        public IActionResult Update([FromBody] FeedbackCreateModel feedback)
        {
            _feedbackService.UpdateFeedback(feedback.Convert());
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _feedbackService.DeleteFeedback(id);
            return result ? NoContent() : NotFound();
        }
    }
}