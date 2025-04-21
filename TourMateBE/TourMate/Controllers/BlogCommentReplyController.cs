using Microsoft.AspNetCore.Mvc;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogCommentReplyController : ControllerBase
    {
        private readonly IBlogCommentReplyService _blogcommentreplyService;

        public BlogCommentReplyController(IBlogCommentReplyService blogcommentreplyService)
        {
            _blogcommentreplyService = blogcommentreplyService;
        }

        [HttpGet("{id}")]
        public ActionResult<BlogCommentReply> Get(int id)
        {
            return Ok(_blogcommentreplyService.GetBlogCommentReply(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<BlogCommentReply>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 0)
        {
            return Ok(_blogcommentreplyService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public IActionResult Create([FromBody] BlogCommentReply blogcommentreply)
        {
            _blogcommentreplyService.CreateBlogCommentReply(blogcommentreply);
            return CreatedAtAction(nameof(Get), new { id = blogcommentreply.BlogCommentReplyId }, blogcommentreply);
        }

        [HttpPut]
        public IActionResult Update([FromBody] BlogCommentReply blogcommentreply)
        {
            _blogcommentreplyService.UpdateBlogCommentReply(blogcommentreply);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _blogcommentreplyService.DeleteBlogCommentReply(id);
            return result ? NoContent() : NotFound();
        }
    }
}