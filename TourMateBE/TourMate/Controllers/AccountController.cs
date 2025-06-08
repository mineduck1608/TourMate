using Microsoft.AspNetCore.Mvc;
using Repositories.DTO;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;
using Services.Utils;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace API.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly ICustomerService _customerService;
        private readonly ITourGuideService _tourGuideService;
        private readonly ITourGuideDescService _tourGuideDescService;
        private readonly IEmailSender _emailSender;
        private readonly ICvapplicationService _cvApplicationService;






        public AccountController(IAccountService accountService, ICustomerService customerService, ITourGuideService tourGuideService, ITourGuideDescService tourGuideDescService, IEmailSender emailSender, ICvapplicationService cvApplicationService)
        {
            _accountService = accountService;
            _customerService = customerService;
            _tourGuideService = tourGuideService;
            _tourGuideDescService = tourGuideDescService;
            _emailSender = emailSender;
            _cvApplicationService = cvApplicationService;
        }

        [HttpPut("changepassword")]
        public async Task<IActionResult> ChangePassword(
        [FromQuery] int accountId,
        [FromQuery] string currentPassword,
        [FromQuery] string newPassword)
        {
            try
            {
                var message = await _accountService.ChangePasswordAsync(accountId, currentPassword, newPassword);
                return Ok(new { msg = message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { msg = ex.Message });
            }
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
            DateTime dob = jsonElement.GetProperty("dateOfBirth").GetDateTime();
            DateOnly dateOfBirth = DateOnly.FromDateTime(dob);

            // Kiểm tra dữ liệu nhập
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password) || string.IsNullOrEmpty(fullName) || string.IsNullOrEmpty(gender) || string.IsNullOrEmpty(phone) || string.IsNullOrEmpty(dateOfBirth.ToString()))
                return BadRequest(new { msg = "Thông tin tài khoản chưa đầy đủ." });

            if (!ValidInput.IsPhoneFormatted(phone.Trim()))
                return BadRequest(new { msg = "Số điện thoại không đúng định dạng." });

            if (!ValidInput.IsMailFormatted(email))
                return BadRequest(new { msg = "Email không đúng định dạng." });

            if (!ValidInput.IsPasswordSecure(password))
                return BadRequest(new { msg = "Mật khẩu cần có ít nhất 12 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt." });

            // Kiểm tra tài khoản đã tồn tại
            var existingAccount = await _accountService.GetAccountByEmail(email);
            if (existingAccount != null)
                return Conflict(new { msg = "Tài khoản đã tồn tại." });

            var existingPhone = await _customerService.GetCustomerByPhone(phone);
            if (existingPhone != null)
                return Conflict(new { msg = "Số điện thoại đã được sử dụng." });

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
                return StatusCode(500, new { msg = "Đã xảy ra lỗi khi đăng ký tài khoản." });

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
                return StatusCode(500, new { msg = "Đã xảy ra lỗi khi đăng ký khách hàng." });

            return Ok(new { msg = "Đăng ký thành công." });
        }
        [HttpGet("get-associated-id")]
        public async Task<ActionResult<int>> GetAssociatedId([FromQuery] int accountId, [FromQuery] string role)
        {
            if (role == "Customer")
            {
                var customer = await _customerService.GetCustomerByAccId(accountId);
                if (customer == null)
                    return NotFound("Customer not found.");
                return Ok(customer.CustomerId);
            }
            else if (role == "TourGuide")
            {
                var tourGuide = await _tourGuideService.GetTourGuideByAccId(accountId);
                if (tourGuide == null)
                    return NotFound("Tour guide not found.");
                return Ok(tourGuide.TourGuideId);
            }
            else
            {
                return BadRequest("Invalid role specified.");
            }
        }


        [HttpPost("registertourguide")]
        public async Task<ActionResult> RegisterTourGuide([FromBody] dynamic request)
        {
            var jsonElement = (JsonElement)request;

            // Lấy thông tin tài khoản
            string email = jsonElement.GetProperty("email").GetString();

            // Tạo mật khẩu ngẫu nhiên
            string password = GenerateRandomPassword(10); // Ví dụ: mật khẩu dài 10 ký tự


            // Lấy thông tin khách hàng
            string fullName = jsonElement.GetProperty("fullName").GetString();
            string gender = jsonElement.GetProperty("gender").GetString();
            string phone = jsonElement.GetProperty("phone").GetString();
            string address = jsonElement.GetProperty("address").GetString();
            string image = jsonElement.GetProperty("image").GetString();
            DateTime dob = jsonElement.GetProperty("dateOfBirth").GetDateTime();

            // Lấy thông tin miêu tả khách hàng
            string description = jsonElement.GetProperty("description").GetString();
            int areaId = jsonElement.GetProperty("areaId").GetInt32();

            // Lấy thông tin phản hồi từ Admin (nếu có)
            int cvApplicationId = jsonElement.GetProperty("cvApplicationId").GetInt32();



            DateOnly dateOfBirth = DateOnly.FromDateTime(dob);

            // Kiểm tra dữ liệu nhập
            if (string.IsNullOrEmpty(cvApplicationId.ToString()) || string.IsNullOrEmpty(image) || string.IsNullOrEmpty(address) || string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password) || string.IsNullOrEmpty(fullName) || string.IsNullOrEmpty(gender) || string.IsNullOrEmpty(phone) || string.IsNullOrEmpty(email) || string.IsNullOrEmpty(dateOfBirth.ToString()))
                return BadRequest("Account details are incomplete.");

            if (!ValidInput.IsPhoneFormatted(phone.Trim()))
                return BadRequest(new { msg = "Phone number is not properly formatted" });

            if (!ValidInput.IsMailFormatted(email))
                return BadRequest(new { msg = "Email is not properly formatted" });

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
                RoleId = 3,
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

            var tourGuideDesc = new TourGuideDesc
            {
                TourGuideId = tourGuide.TourGuideId,
                Description = description,
                AreaId = areaId
            };

            var isTourGuideDescCreated = await _tourGuideDescService.CreateTourGuideDesc(tourGuideDesc);
            if (isTourGuideDescCreated)
                return StatusCode(500, "An error occurred while registering the tourguide desc.");

            var cvApplication = await _cvApplicationService.GetCvapplication(cvApplicationId);
            cvApplication.Status = "Đã xử lí";
            await _cvApplicationService.UpdateCvapplication(cvApplication);

            string emailBody = GenerateTourGuideApprovalEmail(fullName, email, password, cvApplication?.Response);

            try
            {
                await _emailSender.SendEmailAsync(email, "Chấp thuận đăng ký hướng dẫn viên TourMate", emailBody);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Email send failed: {ex.Message}");
            }

            return Ok(new { msg = "Register successfully." });
        }

        private string GenerateTourGuideApprovalEmail(string fullName, string email, string password, string? response = null)
        {
            string responseSection = string.IsNullOrWhiteSpace(response)
                ? ""
                : $@"
      <p class='response-section' style='background-color: #fff3cd; border-left: 5px solid #ffc107; padding: 15px 20px; border-radius: 6px; margin-top: 20px; color: #856404;'>
        <strong>Phản hồi từ quản trị viên:</strong><br />{response}
      </p>";

            return $@"
<!DOCTYPE html>
<html lang='vi'>
<head>
  <meta charset='UTF-8' />
  <meta name='viewport' content='width=device-width, initial-scale=1' />
  <title>Chấp thuận đơn ứng tuyển - TourMate</title>
  <style>
    body, html {{
      margin: 0; padding: 0; height: 100%; width: 100%;
      background-color: #f4f4f4;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #000000;
    }}
    a {{
      color: #ffffff; text-decoration: none;
    }}
    .email-wrapper {{
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 14px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.1);
      overflow: hidden;
    }}
    .email-header {{
      background-color: #2e2e2e;
      padding: 30px 20px;
      text-align: center;
      color: #ffffff;
    }}
    .email-header img {{
      max-width: 180px;
      margin-bottom: 15px;
    }}
    .email-body {{
      padding: 40px 40px 60px;
      font-size: 17px;
      line-height: 1.6;
      color: #333333;
    }}
    .email-body h1 {{
      font-size: 26px;
      font-weight: 700;
      margin-bottom: 20px;
    }}
    .email-body p {{
      margin-bottom: 20px;
    }}
    .highlight {{
      background-color: #f0f0f0;
      padding: 10px 15px;
      border-left: 5px solid #007bff;
      border-radius: 6px;
    }}
    .account-info {{
      background-color: #e9f7ef;
      padding: 12px 16px;
      border-left: 5px solid #28a745;
      border-radius: 6px;
      margin-top: 20px;
    }}
    .response-section {{
      /* custom style if needed */
    }}
    .email-footer {{
      background-color: #f4f4f4;
      color: #555555;
      text-align: center;
      font-size: 13px;
      padding: 20px 30px;
      border-top: 1px solid #dfe3e9;
    }}
    @media only screen and (max-width: 480px) {{
      .email-wrapper {{
        width: 95% !important;
        margin: 20px auto !important;
      }}
      .email-body {{
        font-size: 15px !important;
        padding: 25px 20px 35px !important;
      }}
    }}
  </style>
</head>
<body>
  <div class='email-wrapper' role='article' aria-roledescription='email' lang='vi'>
    <header class='email-header'>
      <img src='https://firebasestorage.googleapis.com/v0/b/badmintoncourtbooking-183b2.appspot.com/o/tourmate%2FLogo.png?alt=media&token=dddca32f-667c-4913-9ccb-0f2d36d6e779' alt='TourMate Logo' />
      <h2>Chúc mừng bạn!</h2>
    </header>
    <section class='email-body'>
      <h1>Đơn ứng tuyển của bạn đã được chấp thuận 🎉</h1>
      <p>Kính gửi <strong>{fullName}</strong>,</p>
      <p>Chúng tôi rất vui mừng thông báo rằng hồ sơ ứng tuyển vị trí <strong>Hướng dẫn viên du lịch</strong> của bạn tại TourMate đã được <strong>chấp thuận</strong>.</p>
      <p class='highlight'>
        Tài khoản của bạn đã được kích hoạt và bạn có thể đăng nhập để bắt đầu cập nhật lịch trình, thông tin cá nhân và sẵn sàng nhận các chuyến đi!
      </p>
      <div class='account-info'>
        <p><strong>Thông tin đăng nhập của bạn:</strong></p>
        <p><strong>Email:</strong> {email}<br />
           <strong>Mật khẩu:</strong> {password}</p>
      </div>

      {responseSection}

      <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc hotline hỗ trợ.</p>
      <p>Chúng tôi rất mong chờ được đồng hành cùng bạn trong hành trình sắp tới.</p>
      <p>Trân trọng,<br />
      Đội ngũ TourMate</p>
    </section>
    <footer class='email-footer'>
      © 2025 TourMate. Bản quyền mọi quyền được bảo lưu.
    </footer>
  </div>
</body>
</html>";
        }



        // Hàm tạo mật khẩu ngẫu nhiên mạnh
        private string GenerateRandomPassword(int length)
        {
            const string valid = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()";
            var res = new StringBuilder();
            using (var rng = RandomNumberGenerator.Create())
            {
                byte[] uintBuffer = new byte[sizeof(uint)];

                while (res.Length < length)
                {
                    rng.GetBytes(uintBuffer);
                    uint num = BitConverter.ToUInt32(uintBuffer, 0);
                    res.Append(valid[(int)(num % (uint)valid.Length)]);
                }
            }

            return res.ToString();
        }

        [HttpPost("rejectcv")]
        public async Task<ActionResult> RejectCvApplication([FromBody] dynamic request)
        {
            try
            {
                var jsonElement = (JsonElement)request;

                int cvApplicationId;
                string response;

                try
                {
                    cvApplicationId = jsonElement.GetProperty("cvApplicationId").GetInt32();
                    response = jsonElement.GetProperty("response").GetString();
                }
                catch (Exception ex)
                {
                    return BadRequest(new { msg = "Dữ liệu đầu vào không hợp lệ.", error = ex.Message });
                }

                if (string.IsNullOrWhiteSpace(response))
                    return BadRequest(new { msg = "Response (lý do từ chối) không được để trống." });

                var cvApplication = await _cvApplicationService.GetCvapplication(cvApplicationId);
                if (cvApplication == null)
                    return NotFound(new { msg = "Không tìm thấy đơn ứng tuyển." });

                // Update trạng thái từ chối và lưu phản hồi
                cvApplication.Status = "Đã từ chối";
                cvApplication.Response = response;



                var updateResult = await _cvApplicationService.UpdateCvapplication(cvApplication);
                if (!updateResult)
                    return StatusCode(500, new { msg = "Không thể cập nhật trạng thái đơn ứng tuyển." });

                // Lấy email và tên ứng viên để gửi mail
                string email = cvApplication.Email; // Giả sử có trường Email trong cvApplication
                string fullName = cvApplication.FullName; // Giả sử có trường FullName trong cvApplication

                if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(fullName))
                    return StatusCode(500, new { msg = "Thiếu thông tin email hoặc họ tên ứng viên." });

                // Tạo email từ chối
                string emailBody = GenerateTourGuideRejectionEmail(fullName, response);

                try
                {
                    await _emailSender.SendEmailAsync(email, "Thông báo từ chối đơn ứng tuyển TourMate", emailBody);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { msg = "Không thể gửi email thông báo.", error = ex.Message });
                }

                return Ok(new { msg = "Từ chối đơn ứng tuyển thành công và email đã được gửi." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    msg = "Đã xảy ra lỗi không xác định trong quá trình xử lý.",
                    error = ex.Message
                });
            }
        }


        private string GenerateTourGuideRejectionEmail(string fullName, string response)
        {
            return $@"
<!DOCTYPE html>
<html lang='vi'>
<head>
  <meta charset='UTF-8' />
  <meta name='viewport' content='width=device-width, initial-scale=1' />
  <title>Thông báo từ chối đơn ứng tuyển - TourMate</title>
  <style>
    body, html {{
      margin: 0; padding: 0; background-color: #f8d7da; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #721c24;
    }}
    .email-wrapper {{
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 14px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.1);
      overflow: hidden;
    }}
    .email-header {{
      background-color: #f5c6cb;
      padding: 30px 20px;
      text-align: center;
      color: #721c24;
    }}
    .email-body {{
      padding: 40px 40px 60px;
      font-size: 17px;
      line-height: 1.6;
    }}
    .email-body h1 {{
      font-size: 26px;
      font-weight: 700;
      margin-bottom: 20px;
    }}
    .response-section {{
      background-color: #f8d7da;
      border-left: 5px solid #f5c6cb;
      padding: 15px 20px;
      border-radius: 6px;
      margin-top: 20px;
      color: #721c24;
      font-style: italic;
    }}
    .email-footer {{
      background-color: #f4f4f4;
      color: #555555;
      text-align: center;
      font-size: 13px;
      padding: 20px 30px;
      border-top: 1px solid #dfe3e9;
    }}
    @media only screen and (max-width: 480px) {{
      .email-wrapper {{
        width: 95% !important;
        margin: 20px auto !important;
      }}
      .email-body {{
        font-size: 15px !important;
        padding: 25px 20px 35px !important;
      }}
    }}
  </style>
</head>
<body>
  <div class='email-wrapper' role='article' aria-roledescription='email' lang='vi'>
    <header class='email-header'>
      <h2>Thông báo từ chối đơn ứng tuyển</h2>
    </header>
    <section class='email-body'>
      <h1>Kính gửi {fullName},</h1>
      <p>Chúng tôi rất tiếc phải thông báo rằng hồ sơ ứng tuyển vị trí <strong>Hướng dẫn viên du lịch</strong> của bạn tại TourMate chưa được chấp nhận.</p>
      <div class='response-section'>
        <strong>Lý do từ chối:</strong><br />
        {response}
      </div>
      <p>Cảm ơn bạn đã quan tâm và gửi hồ sơ cho chúng tôi. Chúc bạn sớm tìm được vị trí phù hợp.</p>
      <p>Trân trọng,<br />Đội ngũ TourMate</p>
    </section>
    <footer class='email-footer'>
      © 2025 TourMate. Bản quyền mọi quyền được bảo lưu.
    </footer>
  </div>
</body>
</html>";
        }


        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest loginRequest)
        {
            // Cố gắng đăng nhập với email và mật khẩu đã cung cấp
            var login = await _accountService.LoginAsync(loginRequest.Email, loginRequest.Password);

            // Nếu đăng nhập không thành công, trả về BadRequest với thông báo lỗi
            if (login == null)
            {
                return BadRequest(new { msg = "Tài khoản hoặc mật khẩu không đúng." });
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
        public IActionResult Create([FromBody] AccountCreateModel data)
        {
            var account = data.Convert();
            _accountService.CreateAccount(account);
            return CreatedAtAction(nameof(Get), new { id = account.AccountId }, account);
        }

        [HttpPut]
        public IActionResult Update([FromBody] AccountCreateModel data)
        {
            var account = data.Convert();
            _accountService.UpdateAccount(account);
            return NoContent();
        }

        [HttpPut("lock/{id}")]
        public async Task<IActionResult> LockAccount(int id)
        {
            var result = await _accountService.LockAccount(id);
            if (result == true)
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

        [HttpPost("request-reset-password")]
        public async Task<IActionResult> RequestResetPassword([FromBody] RequestResetPasswordDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest(new { msg = "Vui lòng nhập email!" });

            var result = await _accountService.RequestPasswordResetAsync(dto.Email);
            if (!result) return BadRequest(new { msg = "Email không tồn tại!" });

            return Ok(new { msg = "Hãy check email của bạn để reset mật khẩu." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Token) || string.IsNullOrWhiteSpace(dto.NewPassword))
                return BadRequest(new { msg = "Thiếu thông tin xử lý!" });

            var result = await _accountService.ResetPasswordAsync(dto.Token, dto.NewPassword);
            if (!result) return BadRequest(new { msg = "Token không hợp lệ hoặc đã hết hạn!" });

            return Ok(new { msg = "Đặt lại mật khẩu thành công." });
        }

        [HttpGet("getbyaccountandrole")]
        public async Task<IActionResult> GetByAccountAndRole([FromQuery] int id, [FromQuery] string role)
        {
            var account = await _accountService.GetByAccountAndRoleAsync(id, role);
            if (account == null)
            {
                return NotFound("Không tìm thấy người dùng.");
            }

            return Ok(account);
        }
    }
}

public record RequestResetPasswordDto(string Email);
public record ResetPasswordDto(string Token, string NewPassword);