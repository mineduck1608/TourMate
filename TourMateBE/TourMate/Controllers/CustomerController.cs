using Microsoft.AspNetCore.Mvc;
using Repositories.DTO;
using Repositories.DTO.UpdateModals;
using Repositories.DTO.UpdateModels;
using Repositories.Models;
using Services;
using Services.Utils;

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

        [HttpGet("by-phone/{phoneNumber}")]
        public async Task<IActionResult> GetByPhone(string phoneNumber)
        {
            var tourGuide = await _customerService.GetCustomerByPhone(phoneNumber);
            if (tourGuide == null)
                return NotFound(new { message = "Không tìm thấy khác hàng theo số điện thoại." });

            return Ok(tourGuide);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetAsync(int id)
        {
            return Ok(await _customerService.GetCustomer(id));
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<Customer>>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1, [FromQuery] string phone = "")
        {
            var result = await _customerService.GetAll(pageSize, pageIndex, phone);

            var response = new PagedResult<Customer>
            {
                Result = result.Result,
                TotalResult = result.TotalResult,  // Tổng số kết quả
                TotalPage = result.TotalPage  // Tổng số trang
            };

            return Ok(response);
        }

        [HttpGet("from-account")]
        public async Task<ActionResult<Customer>> GetFromAccount(int accountId)
        {
            var customer = await _customerService.GetCustomerFromAccount(accountId);
            if (customer == null)
            {
                return NotFound(new { msg = "Không tìm thấy khách hàng!" });
            }
            return Ok(customer);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Customer data)
        {

            if (!ValidInput.IsPhoneFormatted(data.Phone.Trim()))
                return BadRequest(new { msg = "Số điện thoại không đúng!" });
            if (!ValidInput.IsMailFormatted(data.Account.Email))
                return BadRequest(new { msg = "Email không đúng định dạng!" });
            if (!ValidInput.IsPasswordSecure(data.Account.Password))
                return BadRequest(new { msg = "Mật khẩu cần có ít nhất 12 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt." });

            // Kiểm tra tài khoản đã tồn tại
            var existingAccount = await _accountService.GetAccountByEmail(data.Account.Email);
            if (existingAccount != null)
                return Conflict(new { msg = "Tài khoản đã tồn tại!" });

            var existingPhone = await _customerService.GetCustomerByPhone(data.Phone);
            if (existingPhone != null)
                return Conflict(new { msg = "Số điện thoại đã được sử dụng!"});

            if (data.DateOfBirth >= DateOnly.FromDateTime(DateTime.Now))
            {
                return BadRequest(new { msg = "Ngày sinh không đúng!" });
            }

            data.Account.Password = HashString.ToHashString(data.Account.Password);
            data.Account.RoleId = 2;

            var isAccountCreated = await _accountService.CreateAccountAdmin(data.Account);
            if (isAccountCreated != null)
            {
                //Gán Id Account cho Customer
                data.AccountId = isAccountCreated.AccountId;

                // Khởi tạo null để EF Core khỏi nhầm là tạo Account mới
                data.Account = null;
                var result = await _customerService.CreateCustomer(data);
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
        public async Task<IActionResult> Update([FromBody] CustomerAdminUpdateModel data)
        {
            if (!ValidInput.IsPhoneFormatted(data.Phone.Trim()))
                return BadRequest(new { msg = "Số điện thoại không đúng!" });
            if (!ValidInput.IsMailFormatted((string)data.Email))
                return base.BadRequest(new { msg = "Email không đúng định dạng!" });
           

            // Kiểm tra tài khoản đã tồn tại
            var existingAccount = await _accountService.GetAccountByEmail((string)data.Email);
            if (existingAccount != null && existingAccount.AccountId != data.AccountId)
                return Conflict(new { msg = "Tài khoản đã tồn tại!" });


            var existingCustomerByPhone = await _customerService.GetCustomerByPhone((string)data.Phone);
            if (existingCustomerByPhone != null && existingCustomerByPhone.CustomerId != data.CustomerId)
                return Conflict(new { msg = "Số điện thoại đã được sử dụng!" });

            var account = await _accountService.GetAccount(data.AccountId);
            if (account == null) return BadRequest(new { msg = "Tài khoản không đúng!" });

            if (data.DateOfBirth >= DateOnly.FromDateTime(DateTime.Now))
            {
                return BadRequest(new { msg = "Ngày sinh không đúng!" });
            }
            if (data.Password != account.Password)
            {
                if (!ValidInput.IsPasswordSecure((string?)data.Password))
                    return base.BadRequest(new { msg = "Mật khẩu cần có ít nhất 12 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt." });
                account.Password = HashString.ToHashString(data.Password);
            }

            account.Email = data.Email;
            existingCustomerByPhone.FullName = data.FullName;
            existingCustomerByPhone.Phone = data.Phone;
            existingCustomerByPhone.DateOfBirth = data.DateOfBirth;
            existingCustomerByPhone.Gender = data.Gender;


            var updateCustomer = await _customerService.UpdateCustomer(existingCustomerByPhone);
            var updateAccount = await _accountService.UpdateAccount(account);
            if (updateCustomer == true && updateAccount == true)
            {
                return Ok();
            }
            return BadRequest();
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateCustomer([FromBody] CustomerUpdateModel data)
        {
            if (!ValidInput.IsPhoneFormatted(data.Phone.Trim()))
                return BadRequest(new { msg = "Số điện thoại không đúng!" });

            var existingPhone = await _customerService.GetCustomerByPhone(data.Phone);
            if (existingPhone != null && existingPhone.CustomerId != data.CustomerId)
                return Conflict(new { msg = "Số điện thoại đã được sử dụng!" });

            if (data.DateOfBirth >= DateOnly.FromDateTime(DateTime.Now))
            {
                return BadRequest(new { msg = "Ngày sinh không đúng!" });
            }

            var customer = await _customerService.GetCustomerByAccId(data.AccountId);

            if (customer != null)
            {
                customer.FullName = data.FullName;
                customer.DateOfBirth = data.DateOfBirth;
                customer.Phone = data.Phone;
                customer.Gender = data.Gender;
                customer.Image = data.Image;
            }

            var updateCustomer = await _customerService.UpdateCustomer(customer);
            if (updateCustomer == true)
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