using Microsoft.AspNetCore.Mvc;
using Repositories.DTO;
using Repositories.DTO.CreateModels;
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
        public async Task<ActionResult<PagedResult<News>>> GetAllAsync(int size = 10, int page = 1)
        {
            var result = await _newsService.GetAll(size, page);
            // Tạo đối tượng response với dữ liệu đã bọc
            var response = new PagedResult<News>
            {
                Result = result.Result, // Tin tức đã bọc trong "Data"
                TotalResult = result.TotalResult, // Tổng số kết quả
                TotalPage = result.TotalPage // Tổng số trang
            };
            return Ok(result);
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
            return Ok();
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