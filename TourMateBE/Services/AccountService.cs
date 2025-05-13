using Repositories.Models;
using Repositories.DTO;
using Repositories.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Services.Utils;


namespace Services
{
    public interface IAccountService
    {
        Account GetAccount(int id);
        IEnumerable<Account> GetAll(int pageSize, int pageIndex);
        Task<bool> UpdateAccount(Account account);
        bool DeleteAccount(int id);
        Task<AuthResponse> LoginAsync(string email, string password);
        Task<AuthResponse> RefreshNewTokenAsync(string refreshToken);
        Task<Account> GetAccountByEmail(string email);
        Task<bool> CreateAccount(Account account);
        Task<Account> CreateAccountAdmin(Account account);
    }

    // Services/AuthService.cs
    public class AccountService : IAccountService
    {
        private readonly AccountRepository _repo;
        private readonly TokenService _tokenService;
        private readonly ICustomerService _customerService;
        private readonly ITourGuideService _tourGuideService;
        private readonly IRefreshTokenService _refreshTokenService;



        public AccountService(AccountRepository repo, TokenService tokenService, ICustomerService customerService, IRefreshTokenService refreshTokenService, ITourGuideService tourGuideService)
        {
            _repo = repo;
            _tokenService = tokenService;
            _customerService = customerService;
            _tourGuideService = tourGuideService;
            _refreshTokenService = refreshTokenService;
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


        public Account GetAccount(int id)
        {
            return _repo.GetById(id);
        }

        public IEnumerable<Account> GetAll(int pageSize, int pageIndex)
        {
            return _repo.GetAll(pageSize, pageIndex);
        }

        public async Task<bool> CreateAccount(Account account)
        {
            // Gọi phương thức bất đồng bộ để tạo tài khoản
            return await _repo.CreateAsync(account);
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

        public bool DeleteAccount(int id)
        {
            _repo.Remove(id);
            return true;
        }
    }

}
