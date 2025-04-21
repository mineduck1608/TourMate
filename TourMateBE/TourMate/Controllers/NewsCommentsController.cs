using Microsoft.AspNetCore.Mvc;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsCommentsController : ControllerBase
    {
        private readonly INewsCommentsService _newscommentsService;

        public NewsCommentsController(INewsCommentsService newscommentsService)
        {
            _newscommentsService = newscommentsService;
        }

        [HttpGet("{id}")]
        public ActionResult<NewsComment> Get(int id)
        {
            return Ok(_newscommentsService.GetNewsComments(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<NewsComment>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 0)
        {
            return Ok(_newscommentsService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public IActionResult Create([FromBody] NewsComment newscomments)
        {
            _newscommentsService.CreateNewsComments(newscomments);
            return CreatedAtAction(nameof(Get), new { id = newscomments.NewsCommentId }, newscomments);
        }

        [HttpPut]
        public IActionResult Update([FromBody] NewsComment newscomments)
        {
            _newscommentsService.UpdateNewsComments(newscomments);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _newscommentsService.DeleteNewsComments(id);
            return result ? NoContent() : NotFound();
        }
    }
}