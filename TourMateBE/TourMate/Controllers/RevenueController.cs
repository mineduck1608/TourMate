using Microsoft.AspNetCore.Mvc;
using Repositories.DTO;
using Services;

namespace TourMate.Controllers
{
    [ApiController]
    [Route("api/revenue")]
    public class RevenueController : ControllerBase
    {
        private readonly IRevenueService _revenueService;

        public RevenueController(IRevenueService revenueService)
        {
            _revenueService = revenueService;
        }

        /// <summary>
        /// Lấy thống kê doanh thu theo tháng cho hướng dẫn viên
        /// </summary>
        [HttpGet("stats/{tourGuideId}")]
        public async Task<ActionResult<RevenueStatsDto>> GetRevenueStats(
            int tourGuideId,
            [FromQuery] int month = 0,
            [FromQuery] int year = 0)
        {
            try
            {
                // Nếu không truyền month/year thì lấy tháng hiện tại
                if (month == 0) month = DateTime.Now.Month;
                if (year == 0) year = DateTime.Now.Year;

                var stats = await _revenueService.GetRevenueStatsAsync(tourGuideId, month, year);
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Lấy thống kê tháng cụ thể
        /// </summary>
        [HttpGet("monthly/{tourGuideId}")]
        public async Task<ActionResult<MonthlyRevenueDto>> GetMonthlyRevenue(
            int tourGuideId,
            [FromQuery] int month,
            [FromQuery] int year)
        {
            try
            {
                var monthlyRevenue = await _revenueService.GetMonthlyRevenueAsync(tourGuideId, month, year);
                return Ok(monthlyRevenue);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Lấy danh sách doanh thu với filter
        /// </summary>
        [HttpGet("list")]
        public async Task<ActionResult<IEnumerable<RevenueDto>>> GetRevenueList([FromQuery] RevenueFilterDto filter)
        {
            try
            {
                var revenues = await _revenueService.GetRevenueListAsync(filter);
                return Ok(revenues);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Lấy chi tiết một revenue
        /// </summary>
        [HttpGet("{revenueId}")]
        public async Task<ActionResult<RevenueDto>> GetRevenue(int revenueId)
        {
            try
            {
                var revenue = await _revenueService.GetRevenueByIdAsync(revenueId);
                if (revenue == null)
                    return NotFound(new { message = "Revenue not found" });

                return Ok(revenue);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Tạo mới revenue
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<RevenueDto>> CreateRevenue([FromBody] RevenueDto revenueDto)
        {
            try
            {
                var createdRevenue = await _revenueService.CreateRevenueAsync(revenueDto);
                return CreatedAtAction(nameof(GetRevenue), new { revenueId = createdRevenue.RevenueId }, createdRevenue);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Cập nhật revenue
        /// </summary>
        [HttpPut("{revenueId}")]
        public async Task<ActionResult<RevenueDto>> UpdateRevenue(int revenueId, [FromBody] RevenueDto revenueDto)
        {
            try
            {
                var updatedRevenue = await _revenueService.UpdateRevenueAsync(revenueId, revenueDto);
                return Ok(updatedRevenue);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Xóa revenue
        /// </summary>
        [HttpDelete("{revenueId}")]
        public async Task<ActionResult> DeleteRevenue(int revenueId)
        {
            try
            {
                var result = await _revenueService.DeleteRevenueAsync(revenueId);
                if (!result)
                    return NotFound(new { message = "Revenue not found" });

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Tính tỷ lệ tăng trưởng
        /// </summary>
        [HttpGet("growth/{tourGuideId}")]
        public async Task<ActionResult<decimal>> GetGrowthPercentage(
            int tourGuideId,
            [FromQuery] int month,
            [FromQuery] int year)
        {
            try
            {
                var growth = await _revenueService.CalculateGrowthPercentageAsync(tourGuideId, month, year);
                return Ok(new { growthPercentage = growth });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
