using Microsoft.AspNetCore.Mvc;
using Repositories.DTO;
using Repositories.DTO.CreateModels;
using Repositories.DTO.UpdateModals;
using Repositories.DTO.UpdateModels;
using Repositories.Models;
using Services;
using Services.Utils;
using System.Numerics;

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

            if (!ValidInput.IsPhoneFormatted(data.Phone.Trim()))
                return BadRequest(new { msg = "Số điện thoại không đúng!" });
            if (!ValidInput.IsMailFormatted(data.Email))
                return BadRequest(new { msg = "Email không đúng định dạng!" });
            if (!ValidInput.IsPasswordSecure(data.Password))
                return BadRequest(new { msg = "Mật khẩu chưa đủ bảo mật!" });

            // Kiểm tra tài khoản đã tồn tại
            var existingAccount = await _accountService.GetAccountByEmail(data.Email);
            if (existingAccount != null)
                return Conflict(new { msg = "Tài khoảng đã tồn tại!" });

            var existingPhone = await _customerService.GetCustomerByPhone(data.Phone);
            if (existingPhone != null)
                return Conflict(new { msg = "Số điện thoại đã được sử dụng!"});

            if (data.DateOfBirth >= DateOnly.FromDateTime(DateTime.Now))
            {
                return BadRequest(new { msg = "Ngày sinh không đúng!" });
            }


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

        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromBody] CustomerUpdateModel data)
        {
            if (!ValidInput.IsPhoneFormatted(data.Phone.Trim()))
                return BadRequest(new { msg = "Số điện thoại không đúng!" });
            if (!ValidInput.IsMailFormatted(data.Email))
                return BadRequest(new { msg = "Email không đúng định dạng!" });
            if (!ValidInput.IsPasswordSecure(data.Password))
                return BadRequest(new { msg = "Mật khẩu chưa đủ bảo mật!" });

            // Kiểm tra tài khoản đã tồn tại
            var existingAccount = await _accountService.GetAccountByEmail(data.Email);
            if (existingAccount != null)
                return Conflict(new { msg = "Tài khoảng đã tồn tại!" });

            var existingPhone = await _customerService.GetCustomerByPhone(data.Phone);
            if (existingPhone != null)
                return Conflict(new { msg = "Số điện thoại đã được sử dụng!" });

            if (data.DateOfBirth >= DateOnly.FromDateTime(DateTime.Now))
            {
                return BadRequest(new { msg = "Ngày sinh không đúng!" });
            }


            var customer = data.ConvertCustomer();
            var account = data.ConvertAccount();
            var updateCustomer = await _customerService.UpdateCustomer(customer);
            var updateAccount = await _accountService.UpdateAccount(account);
            if (updateCustomer == true && updateAccount == true)
            {
                return Ok();
            }
            return BadRequest();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _customerService.DeleteCustomer(id);
            return result ? NoContent() : NotFound();
        }
    }
}