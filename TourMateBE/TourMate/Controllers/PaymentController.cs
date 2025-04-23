using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentsService _paymentService;

        public PaymentController(IPaymentsService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpGet("{id}")]
        public ActionResult<Payment> Get(int id)
        {
            return Ok(_paymentService.GetPayments(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<Payment>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(_paymentService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public IActionResult Create([FromBody] PaymentCreateModel data)
        {
            var payment = data.Convert();
            _paymentService.CreatePayments(payment);
            return CreatedAtAction(nameof(Get), new { id = payment.PaymentId }, payment);
        }

        [HttpPut]
        public IActionResult Update([FromBody] PaymentCreateModel payment)
        {
            _paymentService.UpdatePayments(payment.Convert());
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _paymentService.DeletePayments(id);
            return result ? NoContent() : NotFound();
        }
    }
}