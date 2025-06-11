using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.DTO.ResultModels;
using Repositories.DTO.UpdateModals;
using Repositories.Models;
using Services;
using System.Linq;

namespace API.Controllers
{
    [Route("api/news")]
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

        [HttpGet]
        public async Task<ActionResult<PagedResult<News>>> Search(string category = "", int pageSize = 10, int pageIndex = 1)
        {
            var result = await _newsService.FilterByCategory(pageSize, pageIndex, category);
            // Tạo đối tượng response với dữ liệu đã bọc
            var response = new PagedResult<News>
            {
                Result = result.Result, // Tin tức đã bọc trong "Data"
                TotalResult = result.TotalResult, // Tổng số kết quả
                TotalPage = result.TotalPage // Tổng số trang
            };
            return Ok(result);
        }
        [HttpGet("recent")]
        public async Task<ActionResult<List<News>>> GetRecentNews(int excludeId, int count)
        {
            return Ok(await _newsService.GetRecentNews(excludeId, count));
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
            var result = await _newsService.CreateNews(news);
            if (result == true)
            {
                return Ok();
            }
            return BadRequest();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsync([FromBody] NewsUpdateModel data)
        {
            var news = data.Convert();
            var result = await _newsService.UpdateNews(news);
            if (result == true)
            {
                return Ok();
            }
            return BadRequest();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var result = await _newsService.DeleteNews(id);
            return result ? NoContent() : NotFound();
        }
    }
}