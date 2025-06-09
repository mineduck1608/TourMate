using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Org.BouncyCastle.Crypto.Generators;
using Repositories.DTO.ResultModels;
using Repositories.Models;
using Repositories.Repository;
using Services.Utils;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;


namespace Services
{
    public interface IAccountService
    {
        Task<Account> GetAccount(int id);
        IEnumerable<Account> GetAll(int pageSize, int pageIndex);
        Task<bool> UpdateAccount(Account account);
        bool DeleteAccount(int id);
        Task<AuthResponse> LoginAsync(string email, string password);
        Task<AuthResponse> RefreshNewTokenAsync(string refreshToken);
        Task<Account> GetAccountByEmail(string email);
        Task<Account> CreateAccount(Account account);
        Task<Account> CreateAccountAdmin(Account account);
        Task<bool> LockAccount(int id);
        Task<bool> UnlockAccount(int id);
        Task<bool> RequestPasswordResetAsync(string email);
        Task<bool> ResetPasswordAsync(string token, string newPassword);
        Task<Account?> GetByAccountAndRoleAsync(int id, string role);
        Task<string> ChangePasswordAsync(int accountId, string currentPassword, string newPassword);
        Task<AuthResponse> GoogleLoginAsync(string email);
    }

        // Services/AuthService.cs
        public class AccountService : IAccountService
        {
            private readonly AccountRepository _repo;
            private readonly TokenService _tokenService;
            private readonly ICustomerService _customerService;
            private readonly ITourGuideService _tourGuideService;
            private readonly IRefreshTokenService _refreshTokenService;
            private readonly IEmailSender _emailSender;



            public AccountService(AccountRepository repo, TokenService tokenService, ICustomerService customerService, IRefreshTokenService refreshTokenService, ITourGuideService tourGuideService, IEmailSender emailSender)
            {
                _repo = repo;
                _tokenService = tokenService;
                _customerService = customerService;
                _tourGuideService = tourGuideService;
                _refreshTokenService = refreshTokenService;
                _emailSender = emailSender;
            }

        public async Task<string> ChangePasswordAsync(int accountId, string currentPassword, string newPassword)
        {
            var account = await _repo.GetByIdAsync(accountId);
            if (account == null)
                throw new Exception("Tài khoản không tồn tại.");

            if (account.Password != HashString.ToHashString(currentPassword))
                throw new Exception("Mật khẩu hiện tại không đúng.");

            if (!ValidInput.IsPasswordSecure(newPassword))
                throw new Exception("Mật khẩu không đủ bảo mật.");

            account.Password = HashString.ToHashString(newPassword);
            await _repo.UpdateAsync(account);

            return "Mật khẩu đã được thay đổi thành công.";
        }

        public async Task<Account?> GetByAccountAndRoleAsync(int id, string role)
        {
            return await _repo.GetByAccountAndRoleAsync(id, role);
        }

        public async Task<AuthResponse> GoogleLoginAsync(string email)
        {
            var user = await _repo.GetAccountByEmail(email);
            if (user == null)
                return null;

            if (user.Role.RoleName == "Customer")
            {
                var customer = await _customerService.GetCustomerByAccId(user.AccountId);
                var accessToken = _tokenService.GenerateAccessToken(user.AccountId, customer.FullName, "Customer");
                var refreshToken = await _tokenService.GenerateAndSaveRefreshTokenAsync(user.AccountId);

                return new AuthResponse
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken
                };
            }

            if (user.Role.RoleName == "TourGuide")
            {
                var tourGuide = await _tourGuideService.GetTourGuideByAccId(user.AccountId);
                var accessToken = _tokenService.GenerateAccessToken(user.AccountId, tourGuide.FullName, "TourGuide");
                var refreshToken = await _tokenService.GenerateAndSaveRefreshTokenAsync(user.AccountId);

                return new AuthResponse
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken
                };
            }

            if (user.Role.RoleName == "Admin")
            {
                var accessToken = _tokenService.GenerateAccessToken(user.AccountId, "Admin", "Admin");
                var refreshToken = await _tokenService.GenerateAndSaveRefreshTokenAsync(user.AccountId);

                return new AuthResponse
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken
                };
            }

            return null;
        }

        public async Task<AuthResponse> LoginAsync(string email, string password)
            {
                password = HashString.ToHashString(password);
                var user = await _repo.GetAccountByLogin(email, password);
                if (user == null || user.Password != password)
                    return null;

                if (user.Role.RoleName == "Customer")
                {
                    var customer = await _customerService.GetCustomerByAccId(user.AccountId);
                    var accessToken = _tokenService.GenerateAccessToken(user.AccountId, customer.FullName, "Customer");
                    var refreshToken = await _tokenService.GenerateAndSaveRefreshTokenAsync(user.AccountId);

                    return new AuthResponse
                    {
                        AccessToken = accessToken,
                        RefreshToken = refreshToken
                    };
                }

                if (user.Role.RoleName == "TourGuide")
                {
                    var tourGuide = await _tourGuideService.GetTourGuideByAccId(user.AccountId);
                    var accessToken = _tokenService.GenerateAccessToken(user.AccountId, tourGuide.FullName, "TourGuide");
                    var refreshToken = await _tokenService.GenerateAndSaveRefreshTokenAsync(user.AccountId);

                    return new AuthResponse
                    {
                        AccessToken = accessToken,
                        RefreshToken = refreshToken
                    };
                }

                if (user.Role.RoleName == "Admin")
                {
                    var accessToken = _tokenService.GenerateAccessToken(user.AccountId, "Admin", "Admin");
                    var refreshToken = await _tokenService.GenerateAndSaveRefreshTokenAsync(user.AccountId);

                    return new AuthResponse
                    {
                        AccessToken = accessToken,
                        RefreshToken = refreshToken
                    };
                }

                return null;
            }


            public async Task<AuthResponse> RefreshNewTokenAsync(string refreshToken)
            {
                var token = await _refreshTokenService.GetByRefreshToken(refreshToken);
                if (token == null || token.ExpireAt < DateTime.UtcNow)
                    return null;

                if (token.User.Role.RoleName == "Customer")
                {
                    var customer = await _customerService.GetCustomerByAccId(token.User.AccountId);
                    var newAccessToken = _tokenService.GenerateAccessToken(token.User.AccountId, customer.FullName, "Customer");
                    var newRefreshToken = await _tokenService.GenerateAndSaveRefreshTokenAsync(token.User.AccountId);

                    return new AuthResponse
                    {
                        AccessToken = newAccessToken,
                        RefreshToken = newRefreshToken
                    };
                }

                if (token.User.Role.RoleName == "TourGuide")
                {
                    var tourGuide = await _tourGuideService.GetTourGuideByAccId(token.User.AccountId);
                    var newAccessToken = _tokenService.GenerateAccessToken(token.User.AccountId, tourGuide.FullName, "TourGuide");
                    var newRefreshToken = await _tokenService.GenerateAndSaveRefreshTokenAsync(token.User.AccountId);

                    return new AuthResponse
                    {
                        AccessToken = newAccessToken,
                        RefreshToken = newRefreshToken
                    };
                }

                if (token.User.Role.RoleName == "Admin")
                {
                    var newAccessToken = _tokenService.GenerateAccessToken(token.User.AccountId, "Admin", "Admin");
                    var newRefreshToken = await _tokenService.GenerateAndSaveRefreshTokenAsync(token.User.AccountId);

                    return new AuthResponse
                    {
                        AccessToken = newAccessToken,
                        RefreshToken = newRefreshToken
                    };
                }

                return null;
            }
            public async Task<Account> GetAccountByEmail(string email)
            {
                // Kiểm tra tài khoản đã tồn tại
                return await _repo.GetAccountByEmail(email);
            }


            public async Task<Account> GetAccount(int id)
            {
                return await _repo.GetByIdAsync(id);
            }

            public IEnumerable<Account> GetAll(int pageSize, int pageIndex)
            {
                return _repo.GetAll(pageSize, pageIndex);
            }

            public async Task<Account> CreateAccount(Account account)
            {
                // Gọi phương thức bất đồng bộ để tạo tài khoản
                return await _repo.CreateAndReturnAsync(account);
            }


            public async Task<Account> CreateAccountAdmin(Account account)
            {
                // Gọi phương thức bất đồng bộ để tạo tài khoản
                return await _repo.CreateAdmin(account);
            }

            public async Task<bool> UpdateAccount(Account account)
            {
                return await _repo.UpdateAsync(account);
            }

            public async Task<bool> LockAccount(int id)
            {
                return await _repo.LockAccount(id);
            }
            public async Task<bool> UnlockAccount(int id)
            {
                return await _repo.UnlockAccount(id);
            }
            public bool DeleteAccount(int id)
            {
                _repo.Remove(id);
                return true;
            }

            public async Task<bool> RequestPasswordResetAsync(string email)
            {
                var user = await _repo.GetAccountByEmail(email);
                if (user == null) return false;

                // Tạo JWT token cho reset password
                var token = _tokenService.GenerateResetPasswordToken(user);

            var resetLink = $"https://tourmate-phi.vercel.app/reset-password/reset?token={token}";

            var emailBody = $@"
<!DOCTYPE html>
<html lang=""vi"">
<head>
<meta charset=""UTF-8"" />
<meta name=""viewport"" content=""width=device-width, initial-scale=1"" />
<title>Đặt lại mật khẩu TourMate</title>
<style>
  body, html {{
    margin: 0; padding: 0; height: 100%; width: 100%; background-color: #e0e0e0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #000000;
  }}
  a {{
    color: #ffffff; text-decoration: none;
  }}
  .email-wrapper {{
    margin: 40px auto;
    background-color: #ffffff;
    border-radius: 14px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.1);
    overflow: hidden;
  }}
  .email-header {{
    background-color: lightgray;
    padding: 30px 20px;
    text-align: center;
    color: #000000;
  }}
  .email-header img {{
    max-width: 200px;
    margin-bottom: 15px;
  }}
  .email-header h1 {{
    margin: 0;
    font-weight: 700;
    font-size: 32px;
    letter-spacing: 1px;
  }}
  .email-header p {{
    margin: 8px 0 0;
    font-style: italic;
    font-weight: 500;
    font-size: 18px;
    opacity: 0.85;
  }}
  .email-body {{
    padding: 40px 40px 60px;
    font-size: 17px;
    line-height: 1.5;
  }}
  .email-body p {{
    margin-bottom: 20px;
  }}
  .email-footer {{
    background-color: #e0e0e0;
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
    .email-header h1 {{
      font-size: 24px !important;
    }}
    .email-header p {{
      font-size: 14px !important;
    }}
    .email-body {{
      font-size: 15px !important;
      padding: 25px 20px 35px !important;
    }}
    .btn-reset {{
      font-size: 18px !important;
      padding: 14px 30px !important;
    }}
  }}
</style>
</head>
<body>
  <div class=""email-wrapper"" role=""article"" aria-roledescription=""email"" lang=""vi"">
    <header class=""email-header"">
      <img src=""https://firebasestorage.googleapis.com/v0/b/badmintoncourtbooking-183b2.appspot.com/o/tourmate%2FLogo.png?alt=media&token=dddca32f-667c-4913-9ccb-0f2d36d6e779"" alt=""TourMate Logo"" />
    </header>
    <section class=""email-body"">
      <h1>TourMate xin chào,</h1>
      <p>Bạn nhận được email này vì chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản TourMate của bạn. Hãy nhấn nút dưới đây để đặt lại mật khẩu !!!</p>
      <p style=""text-align: center;"">
        <a href=""{resetLink}""target=""_blank"" rel=""noopener noreferrer""
   style=""
       display: inline-block;
       background-color: black;
       padding: 15px 45px;
       border-radius: 50px;
       font-weight: 700;
       font-size: 20px;
       color: white;      
       text-align: center;
       text-decoration: none;
       transition: none;  
   "">Đặt lại mật khẩu</a>
      </p>
      <p>Nếu bạn không yêu cầu thay đổi mật khẩu, bạn có thể bỏ qua email này.</p>
      <p>Trân trọng,<br />Đội ngũ TourMate</p>
    </section>
    <footer class=""email-footer"">
      © 2025 TourMate. Bản quyền mọi quyền được bảo lưu.
    </footer>
  </div>
</body>
</html>

";


            await _emailSender.SendEmailAsync(user.Email, "Reset Password", emailBody);

                return true;
            }

            public async Task<bool> ResetPasswordAsync(string token, string newPassword)
            {
                var principal = _tokenService.ValidateResetPasswordToken(token);
                if (principal == null) return false;

                var userIdClaim = principal.FindFirst("AccountId");
                if (userIdClaim == null) return false;

                if (!int.TryParse(userIdClaim.Value, out int userId)) return false;

                var user = await _repo.GetByIdAsync(userId);
                if (user == null) return false;

                user.Password = HashString.ToHashString(newPassword);
                await _repo.UpdateAsync(user);

                return true;
            }

        }

    }

