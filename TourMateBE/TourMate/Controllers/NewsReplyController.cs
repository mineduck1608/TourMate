using Microsoft.AspNetCore.Mvc;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsReplyController : ControllerBase
    {
        private readonly INewsReplyService _newsreplyService;

        public NewsReplyController(INewsReplyService newsreplyService)
        {
            _newsreplyService = newsreplyService;
        }

        [HttpGet("{id}")]
        public ActionResult<NewsReply> Get(int id)
        {
            return Ok(_newsreplyService.GetNewsReply(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<NewsReply>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 0)
        {
            return Ok(_newsreplyService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public IActionResult Create([FromBody] NewsReply newsreply)
        {
            _newsreplyService.CreateNewsReply(newsreply);
            return CreatedAtAction(nameof(Get), new { id = newsreply.NewsReplyId }, newsreply);
        }

        [HttpPut]
        public IActionResult Update([FromBody] NewsReply newsreply)
        {
            _newsreplyService.UpdateNewsReply(newsreply);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _newsreplyService.DeleteNewsReply(id);
            return result ? NoContent() : NotFound();
        }
    }
}