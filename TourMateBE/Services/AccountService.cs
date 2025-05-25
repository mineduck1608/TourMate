using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Repositories.DTO;
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

                var resetLink = $"https://yourfrontend/reset-password?token={token}";
                var emailBody = $"Click the link to reset your password: {resetLink}";

                await _emailSender.SendEmailAsync(user.Email, "Reset Password", emailBody);

                return true;
            }

            public async Task<bool> ResetPasswordAsync(string token, string newPassword)
            {
                var principal = _tokenService.ValidateResetPasswordToken(token);
                if (principal == null) return false;

                var userIdClaim = principal.FindFirst("userId");
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

