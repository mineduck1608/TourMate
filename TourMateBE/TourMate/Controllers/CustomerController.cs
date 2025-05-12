using Microsoft.AspNetCore.Mvc;
using Repositories.DTO;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/customer")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;
        private readonly IAccountService _accountService;

        public CustomerController(ICustomerService customerService, IAccountService accountService)
        {
            _customerService = customerService;
            _accountService = accountService;
        }

        [HttpGet("{id}")]
        public ActionResult<Customer> Get(int id)
        {
            return Ok(_customerService.GetCustomer(id));
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<Customer>>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1,[FromQuery] string email = "", [FromQuery] string phone = "")
        {
            var result = await _customerService.GetAll(pageSize, pageIndex, email, phone);

            var response = new PagedResult<Customer>
            {
                Result = result.Result,
                TotalResult = result.TotalResult,  // Tổng số kết quả
                TotalPage = result.TotalPage  // Tổng số trang
            };

            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CustomerCreateModel data)
        {
            var customer = data.ConvertCustomer();
            var account = data.ConvertAccount();
            var isAccountCreated = await _accountService.CreateAccountAdmin(account);
            if (isAccountCreated != null)
            {
                customer.AccountId = isAccountCreated.AccountId;
                var result = await _customerService.CreateCustomer(customer);
                if (result == true)
                {
                    return Ok();
                }
                else return BadRequest();
            }
            return BadRequest();
        }

        //[HttpPut]
        //public IActionResult Update([FromBody] CustomerCreateModel customer)
        //{
        //    _customerService.UpdateCustomer(customer.Convert());
        //    return NoContent();
        //}

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _customerService.DeleteCustomer(id);
            return result ? NoContent() : NotFound();
        }
    }
}