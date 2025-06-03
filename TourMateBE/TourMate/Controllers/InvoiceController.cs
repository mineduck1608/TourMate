using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;

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
        public ActionResult<Invoice> Get(int id)
        {
            return Ok(_invoiceService.GetInvoice(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<Invoice>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(_invoiceService.GetAll(pageSize, pageIndex));
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


        [HttpPut]
        public IActionResult Update([FromBody] InvoiceCreateModel invoice)
        {
            _invoiceService.UpdateInvoice(invoice.Convert());
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _invoiceService.DeleteInvoice(id);
            return result ? NoContent() : NotFound();
        }
    }
}