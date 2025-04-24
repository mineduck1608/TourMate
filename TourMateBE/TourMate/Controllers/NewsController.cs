using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsController : ControllerBase
    {
        private readonly INewsService _newsService;

        public NewsController(INewsService newsService)
        {
            _newsService = newsService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<News>> GetAsync(int id)
        {
            return Ok(await _newsService.GetNews(id));
        }

        [HttpGet("paged")]
        public async Task<ActionResult<IEnumerable<News>>> GetAllAsync([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(await _newsService.GetAll(pageSize, pageIndex));
        }

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<News>>> GetAllList()
        {
            var result = await _newsService.GetAllList();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] NewsCreateModel data)
        {
            var news = data.Convert();
            await _newsService.CreateNews(news);
            return CreatedAtAction(nameof(GetAsync), new { id = news.NewsId }, news);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateAsync([FromBody] NewsCreateModel news)
        {
            await _newsService.UpdateNews(news.Convert());
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var result = await _newsService.DeleteNews(id);
            return result ? NoContent() : NotFound();
        }
    }
}