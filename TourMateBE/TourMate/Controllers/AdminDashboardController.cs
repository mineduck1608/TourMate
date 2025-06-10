using Microsoft.AspNetCore.Mvc;
using Repositories.DTO;
using Services;

namespace TourMate.Controllers
{
    [ApiController]
    [Route("api/admin-dashboard")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly IAdminDashboardService _dashboardService;
        private readonly ILogger<AdminDashboardController> _logger;

        public AdminDashboardController(
            IAdminDashboardService dashboardService,
            ILogger<AdminDashboardController> logger)
        {
            _dashboardService = dashboardService;
            _logger = logger;
        }

        /// <summary>
        /// Lấy toàn bộ dữ liệu dashboard admin
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<AdminDashboard>> GetDashboardData(
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate,
            [FromQuery] string? areaFilter)
        {
            try
            {
                var filter = new DashboardFilter
                {
                    FromDate = fromDate,
                    ToDate = toDate,
                    AreaFilter = areaFilter
                };

                var dashboardData = await _dashboardService.GetDashboardDataAsync(filter);
                return Ok(dashboardData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting dashboard data");
                return StatusCode(500, new { message = "Lỗi server khi lấy dữ liệu dashboard", error = ex.Message });
            }
        }

        /// <summary>
        /// Lấy thống kê tài chính
        /// </summary>
        [HttpGet("financial")]
        public async Task<ActionResult<FinancialStatus>> GetFinancialStats(
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate,
            [FromQuery] string? areaFilter)
        {
            try
            {
                var filter = new DashboardFilter
                {
                    FromDate = fromDate,
                    ToDate = toDate,
                    AreaFilter = areaFilter
                };

                var financialStats = await _dashboardService.GetFinancialStatsAsync(filter);
                return Ok(financialStats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting financial stats");
                return StatusCode(500, new { message = "Lỗi server khi lấy thống kê tài chính", error = ex.Message });
            }
        }

        /// <summary>
        /// Lấy thống kê theo khu vực
        /// </summary>
        [HttpGet("areas")]
        public async Task<ActionResult<List<AreaStatus>>> GetAreaStats(
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate)
        {
            try
            {
                var filter = new DashboardFilter
                {
                    FromDate = fromDate,
                    ToDate = toDate
                };

                var areaStats = await _dashboardService.GetAreaStatsAsync(filter);
                return Ok(areaStats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting area stats");
                return StatusCode(500, new { message = "Lỗi server khi lấy thống kê khu vực", error = ex.Message });
            }
        }

        /// <summary>
        /// Lấy thống kê người dùng
        /// </summary>
        [HttpGet("users")]
        public async Task<ActionResult<UserStatus>> GetUserStats(
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate)
        {
            try
            {
                var filter = new DashboardFilter
                {
                    FromDate = fromDate,
                    ToDate = toDate
                };

                var userStats = await _dashboardService.GetUserStatsAsync(filter);
                return Ok(userStats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user stats");
                return StatusCode(500, new { message = "Lỗi server khi lấy thống kê người dùng", error = ex.Message });
            }
        }

        /// <summary>
        /// Lấy top tour có hiệu suất cao nhất
        /// </summary>
        [HttpGet("top-tours")]
        public async Task<ActionResult<List<TourPerformance>>> GetTopTours(
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate,
            [FromQuery] string? areaFilter,
            [FromQuery] int limit = 10)
        {
            try
            {
                var filter = new DashboardFilter
                {
                    FromDate = fromDate,
                    ToDate = toDate,
                    AreaFilter = areaFilter
                };

                var topTours = await _dashboardService.GetTopToursAsync(filter, limit);
                return Ok(topTours);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting top tours");
                return StatusCode(500, new { message = "Lỗi server khi lấy top tour", error = ex.Message });
            }
        }

        /// <summary>
        /// Lấy top hướng dẫn viên xuất sắc nhất
        /// </summary>
        [HttpGet("top-guides")]
        public async Task<ActionResult<List<GuidePerformance>>> GetTopGuides(
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate,
            [FromQuery] string? areaFilter,
            [FromQuery] int limit = 10)
        {
            try
            {
                var filter = new DashboardFilter
                {
                    FromDate = fromDate,
                    ToDate = toDate,
                    AreaFilter = areaFilter
                };

                var topGuides = await _dashboardService.GetTopGuidesAsync(filter, limit);
                return Ok(topGuides);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting top guides");
                return StatusCode(500, new { message = "Lỗi server khi lấy top hướng dẫn viên", error = ex.Message });
            }
        }

        /// <summary>
        /// Lấy thống kê gói membership
        /// </summary>
        [HttpGet("membership")]
        public async Task<ActionResult<List<MembershipStatus>>> GetMembershipStats(
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate)
        {
            try
            {
                var filter = new DashboardFilter
                {
                    FromDate = fromDate,
                    ToDate = toDate
                };

                var membershipStats = await _dashboardService.GetMembershipStatsAsync(filter);
                return Ok(membershipStats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting membership stats");
                return StatusCode(500, new { message = "Lỗi server khi lấy thống kê membership", error = ex.Message });
            }
        }

        /// <summary>
        /// Lấy thống kê tour bị hủy theo khu vực
        /// </summary>
        [HttpGet("cancelled-tours")]
        public async Task<ActionResult<List<AreaStatus>>> GetCancelledToursByArea(
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate)
        {
            try
            {
                var filter = new DashboardFilter
                {
                    FromDate = fromDate,
                    ToDate = toDate
                };

                var cancelledStats = await _dashboardService.GetCancelledToursByAreaAsync(filter);
                return Ok(cancelledStats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting cancelled tours stats");
                return StatusCode(500, new { message = "Lỗi server khi lấy thống kê tour bị hủy", error = ex.Message });
            }
        }
    }
}
