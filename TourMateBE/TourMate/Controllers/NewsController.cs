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
        public ActionResult<News> Get(int id)
        {
            return Ok(_newsService.GetNews(id));
        }

        [HttpGet("paged")]
        public ActionResult<IEnumerable<News>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(_newsService.GetAll(pageSize, pageIndex));
        }

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<News>>> GetAllList()
        {
            var result = await _newsService.GetAllList();
            return Ok(result);
        }

        [HttpPost]
        public IActionResult Create([FromBody] NewsCreateModel data)
        {
            var news = data.Convert();
            _newsService.CreateNews(news);
            return CreatedAtAction(nameof(Get), new { id = news.NewsId }, news);
        }

        [HttpPut]
        public IActionResult Update([FromBody] NewsCreateModel news)
        {
            _newsService.UpdateNews(news.Convert());
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _newsService.DeleteNews(id);
            return result ? NoContent() : NotFound();
        }
    }
}