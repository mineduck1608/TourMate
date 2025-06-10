using Microsoft.AspNetCore.Mvc;
using Repositories.DTO;
using Repositories.DTO.CreateModels;
using Repositories.DTO.UpdateModels;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/active-area")]
    [ApiController]
    public class ActiveAreaController : ControllerBase
    {
        private readonly IActiveAreaService _activeareaService;

        public ActiveAreaController(IActiveAreaService activeareaService)
        {
            _activeareaService = activeareaService;
        }

        [HttpGet("id-and-name")]
        public async Task<IActionResult> GetActiveAreas()
        {
            var areas = await _activeareaService.GetActiveAreasAsync();
            return Ok(areas);
        }

        [HttpGet("{id}")]
        public ActionResult<ActiveArea> Get(int id)
        {
            return Ok(_activeareaService.GetActiveArea(id));
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<ActiveArea>>> GetAll(int pageSize = 10, int pageIndex = 1)
        {
            var result = await _activeareaService.GetAll(pageSize, pageIndex);
            var response = new PagedResult<ActiveArea>
            {
                Result = result.Result, // Tin tức đã bọc trong "Data"
                TotalResult = result.TotalResult, // Tổng số kết quả
                TotalPage = result.TotalPage // Tổng số trang
            };
            return Ok(result);
        }
        [HttpGet("simplified")]
        public async Task<ActionResult<IEnumerable<SimplifiedAreaListResult>>> GetSimplifiedArea()
        {
            return Ok(await _activeareaService.GetSimplifiedAreas());
        }

        [HttpGet("most-popular")]
        public async Task<ActionResult<IEnumerable<MostPopularArea>>> GetMostPopular()
        {
            return Ok(await _activeareaService.GetMostPopularAreas());
        }

        [HttpGet("filtered-area")]
        public async Task<ActionResult<PagedResult<ActiveArea>>> GetActiveAreas(
        string search = "",
        string region = "",
        int pageIndex = 1,
        int pageSize = 8)
        {
            // Gọi service để lấy dữ liệu đã lọc và phân trang
            var result = await _activeareaService.GetActiveAreas(search, region, pageIndex, pageSize);

            // Tạo đối tượng PagedResult để trả về cho client
            var response = new PagedResult<ActiveArea>
            {
                Result = result.Result,  // Các ActiveArea đã lọc
                TotalResult = result.TotalResult,  // Tổng số kết quả
                TotalPage = result.TotalPage  // Tổng số trang
            };

            return Ok(response);  // Trả về dữ liệu dưới dạng OK response
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ActiveAreaCreateModel data)
        {
            var activearea = data.Convert();
            var result = await _activeareaService.CreateActiveArea(activearea);
            if (result == true)
            {
                return Ok();
            }
            return BadRequest();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromBody] ActiveAreaUpdateModal data)
        {
            var activearea = data.Convert();
            var result = await _activeareaService.UpdateActiveArea(activearea);
            if (result == true)
            {
                return Ok();
            }
            return BadRequest();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _activeareaService.DeleteActiveArea(id);
            return result ? NoContent() : NotFound();
        }

        [HttpGet("random")]
        public async Task<IActionResult> GetRandomActiveAreas([FromQuery] int size)
        {
            try
            {
                var result = await _activeareaService.GetRandomActiveAreaAsync(size);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong", error = ex.Message });
            }
        }

        [HttpGet("other")]
        public async Task<IActionResult> GetOtherActiveArea([FromQuery] int currentActiveAreaId, [FromQuery] int size)
        {
            try
            {
                var result = await _activeareaService.GetOtherActiveAreaAsync(currentActiveAreaId, size);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong", error = ex.Message });
            }
        }
    }
}