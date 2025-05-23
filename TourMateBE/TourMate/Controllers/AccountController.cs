﻿using Microsoft.AspNetCore.Mvc;
using Repositories.DTO;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;
using System.Text.Json;
using Services.Utils;

namespace API.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly ICustomerService _customerService;
        private readonly ITourGuideService _tourGuideService;



        public AccountController(IAccountService accountService, ICustomerService customerService, ITourGuideService tourGuideService)
        {
            _accountService = accountService;
            _customerService = customerService;
            _tourGuideService = tourGuideService;
        }

        [HttpPost("registercustomer")]
        public async Task<ActionResult> RegisterCustomer([FromBody] dynamic request)
        {
            var jsonElement = (JsonElement)request;

            // Lấy thông tin tài khoản
            string email = jsonElement.GetProperty("email").GetString();
            string password = jsonElement.GetProperty("password").GetString();

            // Lấy thông tin khách hàng
            string fullName = jsonElement.GetProperty("fullName").GetString();
            string gender = jsonElement.GetProperty("gender").GetString();
            string phone = jsonElement.GetProperty("phone").GetString();
            string address = jsonElement.GetProperty("address").GetString();
            DateTime dob = jsonElement.GetProperty("dateOfBirth").GetDateTime();
            DateOnly dateOfBirth = DateOnly.FromDateTime(dob);

            // Kiểm tra dữ liệu nhập
            if (string.IsNullOrEmpty(address) || string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password) || string.IsNullOrEmpty(fullName) || string.IsNullOrEmpty(gender) || string.IsNullOrEmpty(phone) || string.IsNullOrEmpty(email) || string.IsNullOrEmpty(dateOfBirth.ToString()))
                return BadRequest("Account details are incomplete.");

            if (!ValidInput.IsPhoneFormatted(phone.Trim()))
                return BadRequest(new { msg = "Phone number is not properly formatted" });

            if (!ValidInput.IsMailFormatted(email))
                return BadRequest(new { msg = "Email is not properly formatted" });

            if (!ValidInput.IsPasswordSecure(password))
                return BadRequest(new { msg = "Password is not secure enough" });

            // Kiểm tra tài khoản đã tồn tại
            var existingAccount = await _accountService.GetAccountByEmail(email);
            if (existingAccount != null)
                return Conflict("Username already exists.");

            var existingPhone = await _customerService.GetCustomerByPhone(phone);
            if (existingPhone != null)
                return Conflict("Phone is used.");

            // Tạo đối tượng tài khoản
            var account = new Account
            {
                Email = email,
                Password = HashString.ToHashString(password),
                RoleId = 1,
                Status = true,
                CreatedDate  = DateTime.Now,
            };

            // Lưu tài khoản
            var isAccountCreated = await _accountService.CreateAccount(account);
            if (isAccountCreated == null)
                return StatusCode(500, "An error occurred while registering the account.");

            // Tạo đối tượng khách hàng
            var customer = new Customer
            {
                AccountId = isAccountCreated.AccountId,
                FullName = fullName,
                Gender = gender,
                Phone = phone,
                DateOfBirth = dateOfBirth,
            };

            

            // Lưu khách hàng
            var isCustomerCreated = await _customerService.CreateCustomer(customer);
            if (!isCustomerCreated)
                return StatusCode(500, "An error occurred while registering the customer.");

            return Ok(new { msg = "Register successfully." });
        }

        [HttpPost("registertourguide")]
        public async Task<ActionResult> RegisterTourGuide([FromBody] dynamic request)
        {
            var jsonElement = (JsonElement)request;

            // Lấy thông tin tài khoản
            string email = jsonElement.GetProperty("email").GetString();
            string password = jsonElement.GetProperty("password").GetString();

            // Lấy thông tin khách hàng
            string fullName = jsonElement.GetProperty("fullName").GetString();
            string gender = jsonElement.GetProperty("gender").GetString();
            string phone = jsonElement.GetProperty("phone").GetString();
            string address = jsonElement.GetProperty("address").GetString();
            string image = jsonElement.GetProperty("image").GetString();
            DateTime dob = jsonElement.GetProperty("dateOfBirth").GetDateTime();
            DateOnly dateOfBirth = DateOnly.FromDateTime(dob);

            // Kiểm tra dữ liệu nhập
            if (string.IsNullOrEmpty(image) || string.IsNullOrEmpty(address) || string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password) || string.IsNullOrEmpty(fullName) || string.IsNullOrEmpty(gender) || string.IsNullOrEmpty(phone) || string.IsNullOrEmpty(email) || string.IsNullOrEmpty(dateOfBirth.ToString()))
                return BadRequest("Account details are incomplete.");

            if (!ValidInput.IsPhoneFormatted(phone.Trim()))
                return BadRequest(new { msg = "Phone number is not properly formatted" });

            if (!ValidInput.IsMailFormatted(email))
                return BadRequest(new { msg = "Email is not properly formatted" });

            if (!ValidInput.IsPasswordSecure(password))
                return BadRequest(new { msg = "Password is not secure enough" });

            // Kiểm tra tài khoản đã tồn tại
            var existingAccount = await _accountService.GetAccountByEmail(email);
            if (existingAccount != null)
                return Conflict("Username already exists.");

            var existingPhone = await _customerService.GetCustomerByPhone(phone);
            if (existingPhone != null)
                return Conflict("Phone is used.");

            // Tạo đối tượng tài khoản
            var account = new Account
            {
                Email = email,
                Password = HashString.ToHashString(password),
                RoleId = 2,
                Status = true,
                CreatedDate = DateTime.Now,
            };
            // Lưu tài khoản
            var isAccountCreated = await _accountService.CreateAccount(account);
            if (isAccountCreated == null)
                return StatusCode(500, "An error occurred while registering the account.");

            // Tạo đối tượng hướng dẫn viên
            var tourGuide = new TourGuide
            {
                AccountId = isAccountCreated.AccountId,
                FullName = fullName,
                Gender = gender,
                Phone = phone,
                DateOfBirth = dateOfBirth,
                Address = address,
                Image = image
            };

        

            // Lưu khách hàng
            var isTourGuideCreated = await _tourGuideService.CreateTourGuide(tourGuide);
            if (!isTourGuideCreated)
                return StatusCode(500, "An error occurred while registering the tourguide.");

            return Ok(new { msg = "Register successfully." });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest loginRequest)
        {
            // Cố gắng đăng nhập với email và mật khẩu đã cung cấp
            var login = await _accountService.LoginAsync(loginRequest.Email, loginRequest.Password);

            // Nếu đăng nhập không thành công, trả về BadRequest với thông báo lỗi
            if (login == null)
            {
                return BadRequest(new { msg = "Username or password is not correct." });
            }

            // Nếu đăng nhập thành công, trả về phản hồi đăng nhập
            return Ok(login);
        }


        [HttpGet("{id}")]
        public ActionResult<Account> Get(int id)
        {
            return Ok(_accountService.GetAccount(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<Account>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(_accountService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public IActionResult Create([FromBody] AcountCreateModel data)
        {
            var account = data.Convert();
            _accountService.CreateAccount(account);
            return CreatedAtAction(nameof(Get), new { id = account.AccountId }, account);
        }

        [HttpPut]
        public IActionResult Update([FromBody] AcountCreateModel data)
        {
            var account = data.Convert();
            _accountService.UpdateAccount(account);
            return NoContent();
        }

        [HttpPut("lock/{id}")]
        public async Task<IActionResult> LockAccount(int id)
        {
            var result = await _accountService.LockAccount(id);
            if(result == true)
            {
                return Ok();
            }
            return BadRequest();
        }

        [HttpPut("unlock/{id}")]
        public async Task<IActionResult> UnlockAccount(int id)
        {
            var result = await _accountService.UnlockAccount(id);
            if (result == true)
            {
                return Ok();
            }
            return BadRequest();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _accountService.DeleteAccount(id);
            return result ? NoContent() : NotFound();
        }
    }
}