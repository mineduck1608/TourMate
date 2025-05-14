using Microsoft.AspNetCore.Mvc;
using Repositories.DTO;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/blogs")]
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
        public ActionResult<IEnumerable<Blog>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(_blogService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public IActionResult Create([FromBody] BlogCreateModel data)
        {
            var blog = data.Convert();
            _blogService.CreateBlog(blog);
            return CreatedAtAction(nameof(Get), new { id = blog.BlogId }, blog);
        }

        [HttpPut]
        public IActionResult Update([FromBody] BlogCreateModel blog)
        {
            _blogService.UpdateBlog(blog.Convert());
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var result = await _blogService.DeleteBlog(id);
            return result ? NoContent() : NotFound();
        }

        [HttpGet("from-account")]
        public async Task<ActionResult<PagedResult<Blog>>> GetBlogsOfAccount(int accountId, int pageSize = 10, int pageIndex = 1)
        {
            return Ok(_blogService.GetBlogsOfAccount(accountId, pageSize, pageIndex));
        }
    }
}