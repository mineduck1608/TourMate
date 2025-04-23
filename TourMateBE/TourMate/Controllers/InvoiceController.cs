using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/[controller]")]
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
        public IActionResult Create([FromBody] InvoiceCreateModel data)
        {
            var invoice = data.Convert();
            _invoiceService.CreateInvoice(invoice);
            return CreatedAtAction(nameof(Get), new { id = invoice.InvoiceId }, invoice);
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