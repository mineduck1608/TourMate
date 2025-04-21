using Microsoft.AspNetCore.Mvc;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogCommentController : ControllerBase
    {
        private readonly IBlogCommentService _blogcommentService;

        public BlogCommentController(IBlogCommentService blogcommentService)
        {
            _blogcommentService = blogcommentService;
        }

        [HttpGet("{id}")]
        public ActionResult<BlogComment> Get(int id)
        {
            return Ok(_blogcommentService.GetBlogComment(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<BlogComment>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 0)
        {
            return Ok(_blogcommentService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public IActionResult Create([FromBody] BlogComment blogcomment)
        {
            _blogcommentService.CreateBlogComment(blogcomment);
            return CreatedAtAction(nameof(Get), new { id = blogcomment.BlogCommentId }, blogcomment);
        }

        [HttpPut]
        public IActionResult Update([FromBody] BlogComment blogcomment)
        {
            _blogcommentService.UpdateBlogComment(blogcomment);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _blogcommentService.DeleteBlogComment(id);
            return result ? NoContent() : NotFound();
        }
    }
}