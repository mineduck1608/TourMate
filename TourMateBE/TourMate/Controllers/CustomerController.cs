using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/customers")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;

        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpGet("{id}")]
        public ActionResult<Customer> Get(int id)
        {
            return Ok(_customerService.GetCustomer(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<Customer>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(_customerService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public IActionResult Create([FromBody] CustomerCreateModel data)
        {
            var customer = data.Convert();
            _customerService.CreateCustomer(customer);
            return CreatedAtAction(nameof(Get), new { id = customer.CustomerId }, customer);
        }

        [HttpPut]
        public IActionResult Update([FromBody] CustomerCreateModel customer)
        {
            _customerService.UpdateCustomer(customer.Convert());
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _customerService.DeleteCustomer(id);
            return result ? NoContent() : NotFound();
        }
    }
}