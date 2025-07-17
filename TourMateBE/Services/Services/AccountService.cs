using Microsoft.Extensions.Configuration;
using Repositories.IRepositories;
using Repositories.Models;
using Repositories.ResponseModels;
using Services.IServices;
using Services.Utils;


namespace Services.Services
{
        public class AccountService : IAccountService
        {
            private readonly IAccountRepository _repo;
            private readonly TokenService _tokenService;
            private readonly ICustomerService _customerService;
            private readonly ITourGuideService _tourGuideService;
            private readonly IRefreshTokenService _refreshTokenService;
            private readonly IEmailSender _emailSender;
            private readonly IConfiguration _config;
            private readonly EmailBody _emailBody;



        public AccountService(IAccountRepository repo, TokenService tokenService, ICustomerService customerService, IRefreshTokenService refreshTokenService, ITourGuideService tourGuideService, IEmailSender emailSender, IConfiguration config, EmailBody emailBody)
            {
                _repo = repo;
                _tokenService = tokenService;
                _customerService = customerService;
                _tourGuideService = tourGuideService;
                _refreshTokenService = refreshTokenService;
                _emailSender = emailSender;
                _config = config;
                _emailBody = emailBody;
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


        public async Task<AuthResponse?> RefreshNewTokenAsync(string refreshToken)
        {
            var token = await _refreshTokenService.GetByRefreshToken(refreshToken);
            if (token == null || token.ExpireAt < DateTime.UtcNow || token.IsRevoked)
                return null;

            token.IsRevoked = true;
            await _refreshTokenService.UpdateRefreshToken(token);

            var user = token.User;
            string fullName;

            var account = await _repo.GetRoleByAccountId(user.AccountId);
            string roleName = account.Role.RoleName;

            switch (roleName)
            {
                case "Customer":
                    var customer = await _customerService.GetCustomerByAccId(user.AccountId);
                    fullName = customer.FullName;
                    break;
                case "TourGuide":
                    var tourGuide = await _tourGuideService.GetTourGuideByAccId(user.AccountId);
                    fullName = tourGuide.FullName;
                    break;
                case "Admin":
                    fullName = "Admin";
                    break;
                default:
                    return null;
            }

            var newAccessToken = _tokenService.GenerateAccessToken(user.AccountId, fullName, roleName);
            var newRefreshToken = await _tokenService.GenerateAndSaveRefreshTokenAsync(user.AccountId);

            return new AuthResponse
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
            };
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

            // Tạo token
            var token = _tokenService.GenerateResetPasswordToken(user);
            var baseUrl = _config["FrontEndURL:BaseUrl"];
            var resetLink = $"{baseUrl}/reset-password/reset?token={token}";

            // Tạo nội dung email HTML
            var emailBody = _emailBody.BuildResetPasswordEmail(resetLink);

            // Gửi email
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

