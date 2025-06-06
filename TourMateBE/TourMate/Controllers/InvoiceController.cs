using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/invoices")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceService _invoiceService;

        public InvoiceController(IInvoiceService invoiceService)
        {
            _invoiceService = invoiceService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Invoice>> Get(int id)
        {
            return Ok(await _invoiceService.GetInvoice(id));
        }

        [HttpGet]
        public async Task<IActionResult> GetPaged(
        [FromQuery] string status,
        [FromQuery] string search = "",
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 5, 
        [FromQuery] int accountId = 1,
        [FromQuery] string role = ""
        )
        {
            var result = await _invoiceService.GetPagedAsync(status, search, page, pageSize, accountId, role);
            return Ok(result);
        }

        [HttpGet("schedule/{id}")]
        public async Task<IActionResult> GetScheduleByInvoiceId(int id)
        {
            var result = await _invoiceService.GetScheduleByInvoiceIdAsync(id);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] InvoiceCreateModel data)
        {
            if (data == null)
                return BadRequest(new { msg = "Dữ liệu gửi lên không hợp lệ." });

            if (data.StartDate < DateTime.Now || data.EndDate < DateTime.Now)
            {
                return BadRequest(new { msg = "Ngày bắt đầu và ngày kết thúc không được nhỏ hơn ngày hiện tại." });
            }

            if (data.StartDate > data.EndDate)
            {
                return BadRequest(new { msg = "Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc." });
            }

            var invoice = data.Convert();
            var ketQua = await _invoiceService.CreateInvoice(invoice);

            if (ketQua)
            {
                return Ok(new { msg = "Tạo hóa đơn thành công." });
            }

            return BadRequest(new { msg = "Tạo hóa đơn thất bại." });
        }


        [HttpPut("deny/{id}")]
        public async Task<IActionResult> Update(int id)
        {
            var result = await _invoiceService.GetInvoice(id);
            result.Status = "Từ chối";
            var isUpdated = await _invoiceService.UpdateInvoice(result);

            if (isUpdated)
            {
                return Ok(new { msg = "Từ chối lịch hẹn thành công." });
            }

            return BadRequest(new { msg = "Từ chối lịch hẹn thất bại." });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _invoiceService.DeleteInvoice(id);
            return result ? NoContent() : NotFound();
        }
    }
}