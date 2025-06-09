using Microsoft.AspNetCore.Mvc;
using Repositories.DTO;
using Services;
using ClosedXML.Excel;

namespace TourMate.Controllers
{
    [ApiController]
    [Route("api/revenue")]
    public class RevenueController : ControllerBase
    {
        private readonly IRevenueService _revenueService;
        private readonly ITourGuideService _tourGuideService;

        public RevenueController(IRevenueService revenueService, ITourGuideService tourGuideService)
        {
            _revenueService = revenueService;
            _tourGuideService = tourGuideService;
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

        /// <summary>
        /// Xuất báo cáo doanh thu ra Excel
        /// </summary>
        [HttpGet("export/{tourGuideId}")]
        public async Task<IActionResult> ExportToExcel(
            int tourGuideId,
            [FromQuery] int month,
            [FromQuery] int year)
        {
            try
            {
                // Lấy dữ liệu doanh thu
                var stats = await _revenueService.GetRevenueStatsAsync(tourGuideId, month, year);
                var tourGuide = await _tourGuideService.GetTourGuide(tourGuideId);

                if (stats == null)
                    return NotFound(new { message = "Không tìm thấy dữ liệu doanh thu" });

                // Tạo file Excel với ClosedXML
                using (var workbook = new XLWorkbook())
                {
                    var worksheet = workbook.Worksheets.Add("Báo Cáo Doanh Thu");

                    // Title
                    worksheet.Range("A1:G1").Merge();
                    worksheet.Cell("A1").Value = $"BÁO CÁO DOANH THU - {GetMonthName(month)} {year}";
                    worksheet.Cell("A1").Style.Font.Bold = true;
                    worksheet.Cell("A1").Style.Font.FontSize = 16;
                    worksheet.Cell("A1").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    worksheet.Cell("A1").Style.Fill.BackgroundColor = XLColor.LightBlue;

                    // Thông tin hướng dẫn viên
                    worksheet.Cell("A3").Value = "Hướng dẫn viên:";
                    worksheet.Cell("B3").Value = tourGuide?.FullName ?? "N/A";
                    worksheet.Cell("A4").Value = "Mã số:";
                    worksheet.Cell("B4").Value = tourGuideId;
                    worksheet.Cell("A5").Value = "Ngày xuất báo cáo:";
                    worksheet.Cell("B5").Value = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");

                    // Tổng quan
                    worksheet.Range("A7:G7").Merge();
                    worksheet.Cell("A7").Value = "TỔNG QUAN";
                    worksheet.Cell("A7").Style.Font.Bold = true;
                    worksheet.Cell("A7").Style.Fill.BackgroundColor = XLColor.LightGray;

                    worksheet.Cell("A8").Value = "Tổng doanh thu:";
                    worksheet.Cell("B8").Value = stats.TotalRevenue;
                    worksheet.Cell("B8").Style.NumberFormat.Format = "#,##0";

                    worksheet.Cell("A9").Value = "Phí nền tảng (15%):";
                    worksheet.Cell("B9").Value = stats.PlatformFee;
                    worksheet.Cell("B9").Style.NumberFormat.Format = "#,##0";

                    worksheet.Cell("A10").Value = "Doanh thu thực nhận:";
                    worksheet.Cell("B10").Value = stats.NetRevenue;
                    worksheet.Cell("B10").Style.NumberFormat.Format = "#,##0";
                    worksheet.Cell("B10").Style.Font.Bold = true;

                    worksheet.Cell("A11").Value = "Tổng số giao dịch:";
                    worksheet.Cell("B11").Value = stats.TotalRecords;

                    worksheet.Cell("A12").Value = "Đã thanh toán:";
                    worksheet.Cell("B12").Value = stats.CompletedPayments;

                    worksheet.Cell("A13").Value = "Chờ thanh toán:";
                    worksheet.Cell("B13").Value = stats.PendingPayments;

                    worksheet.Cell("A14").Value = "Tăng trưởng:";
                    worksheet.Cell("B14").Value = $"{stats.MonthlyGrowth}%";

                    // Chi tiết giao dịch
                    worksheet.Range("A16:G16").Merge();
                    worksheet.Cell("A16").Value = "CHI TIẾT GIAO DỊCH";
                    worksheet.Cell("A16").Style.Font.Bold = true;
                    worksheet.Cell("A16").Style.Fill.BackgroundColor = XLColor.LightGray;

                    // Header
                    worksheet.Cell("A17").Value = "ID";
                    worksheet.Cell("B17").Value = "Ngày tạo";
                    worksheet.Cell("C17").Value = "Tổng tiền";
                    worksheet.Cell("D17").Value = "Phí nền tảng";
                    worksheet.Cell("E17").Value = "Thực nhận";
                    worksheet.Cell("F17").Value = "Trạng thái";

                    var headerRange = worksheet.Range("A17:F17");
                    headerRange.Style.Font.Bold = true;
                    headerRange.Style.Fill.BackgroundColor = XLColor.LightGray;
                    headerRange.Style.Border.BottomBorder = XLBorderStyleValues.Thin;

                    // Data
                    int row = 18;
                    foreach (var revenue in stats.RevenueList)
                    {
                        worksheet.Cell($"A{row}").Value = revenue.RevenueId;
                        worksheet.Cell($"B{row}").Value = revenue.CreatedAt.ToString("dd/MM/yyyy");
                        worksheet.Cell($"C{row}").Value = revenue.TotalAmount;
                        worksheet.Cell($"C{row}").Style.NumberFormat.Format = "#,##0";
                        worksheet.Cell($"D{row}").Value = revenue.PlatformCommission;
                        worksheet.Cell($"D{row}").Style.NumberFormat.Format = "#,##0";
                        worksheet.Cell($"E{row}").Value = revenue.ActualReceived;
                        worksheet.Cell($"E{row}").Style.NumberFormat.Format = "#,##0";
                        worksheet.Cell($"F{row}").Value = revenue.PaymentStatus ? "Đã thanh toán" : "Chờ thanh toán";

                        if (revenue.PaymentStatus)
                        {
                            worksheet.Cell($"F{row}").Style.Font.FontColor = XLColor.Green;
                        }
                        else
                        {
                            worksheet.Cell($"F{row}").Style.Font.FontColor = XLColor.Orange;
                        }

                        row++;
                    }

                    // Auto fit columns
                    worksheet.ColumnsUsed().AdjustToContents();

                    // Thông tin thanh toán
                    row += 2;
                    worksheet.Range($"A{row}:G{row}").Merge();
                    worksheet.Cell($"A{row}").Value = "THÔNG TIN THANH TOÁN";
                    worksheet.Cell($"A{row}").Style.Font.Bold = true;
                    worksheet.Cell($"A{row}").Style.Fill.BackgroundColor = XLColor.LightGray;

                    row++;
                    worksheet.Range($"A{row}:G{row + 3}").Merge();
                    worksheet.Cell($"A{row}").Value = $"Số tiền thực nhận {stats.NetRevenue:N0} VND sẽ được chuyển khoản vào tài khoản đã đăng ký trong vòng 3-5 ngày làm việc. Phí nền tảng 15% đã được trừ tự động. Nếu có thắc mắc, vui lòng liên hệ bộ phận hỗ trợ qua hotline: 0977 300 916";
                    worksheet.Cell($"A{row}").Style.Alignment.WrapText = true;

                    // Convert to byte array
                    using (var stream = new MemoryStream())
                    {
                        workbook.SaveAs(stream);
                        var fileBytes = stream.ToArray();

                        // Return Excel file
                        return File(
                            fileBytes,
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            $"revenue-report-{month}-{year}.xlsx");
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        private string GetMonthName(int month)
        {
            return month switch
            {
                1 => "Tháng 1",
                2 => "Tháng 2",
                3 => "Tháng 3",
                4 => "Tháng 4",
                5 => "Tháng 5",
                6 => "Tháng 6",
                7 => "Tháng 7",
                8 => "Tháng 8",
                9 => "Tháng 9",
                10 => "Tháng 10",
                11 => "Tháng 11",
                12 => "Tháng 12",
                _ => $"Tháng {month}"
            };
        }
    }
}
