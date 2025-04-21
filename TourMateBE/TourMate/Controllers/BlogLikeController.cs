using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogLikeController : ControllerBase
    {
        private readonly IBlogLikeService _bloglikeService;

        public BlogLikeController(IBlogLikeService bloglikeService)
        {
            _bloglikeService = bloglikeService;
        }

        [HttpGet("{id}")]
        public ActionResult<BlogLike> Get(int id)
        {
            return Ok(_bloglikeService.GetBlogLike(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<BlogLike>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(_bloglikeService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public IActionResult Create([FromBody] BlogLikeCreateModel data)
        {
            var bloglike = data.Convert();
            _bloglikeService.CreateBlogLike(bloglike);
            return CreatedAtAction(nameof(Get), new { id = bloglike.BlogLikeId }, bloglike);
        }

        [HttpPut]
        public IActionResult Update([FromBody] BlogLikeCreateModel bloglike)
        {
            _bloglikeService.UpdateBlogLike(bloglike.Convert());
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _bloglikeService.DeleteBlogLike(id);
            return result ? NoContent() : NotFound();
        }
    }
}