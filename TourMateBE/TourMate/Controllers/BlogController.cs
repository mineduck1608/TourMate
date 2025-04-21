using Microsoft.AspNetCore.Mvc;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly IBlogService _blogService;

        public BlogController(IBlogService blogService)
        {
            _blogService = blogService;
        }

        [HttpGet("{id}")]
        public ActionResult<Blog> Get(int id)
        {
            return Ok(_blogService.GetBlog(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<Blog>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 0)
        {
            return Ok(_blogService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public IActionResult Create([FromBody] Blog blog)
        {
            _blogService.CreateBlog(blog);
            return CreatedAtAction(nameof(Get), new { id = blog.BlogId }, blog);
        }

        [HttpPut]
        public IActionResult Update([FromBody] Blog blog)
        {
            _blogService.UpdateBlog(blog);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _blogService.DeleteBlog(id);
            return result ? NoContent() : NotFound();
        }
    }
}