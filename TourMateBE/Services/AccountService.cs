using Repositories.Models;
using Repositories.DTO;
using Repositories.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TourMate.Utils;


namespace Services
{
    public interface IAccountService
    {

    }

    // Services/AuthService.cs
    public class AccountService : IAccountService
    {
        private readonly AccountRepository _repo;
        private readonly TokenService _tokenService;
        private readonly CustomerService _customerService;
        private readonly TourGuideService _tourGuideService;
        private readonly RefreshTokenService _refreshTokenService;



        public AccountService(AccountRepository repo, TokenService tokenService, CustomerService customerService, RefreshTokenService refreshTokenService, TourGuideService tourGuideService)
        {
            _repo = repo;
            _tokenService = tokenService;
            _customerService = customerService;
            _tourGuideService = tourGuideService;
            _refreshTokenService = refreshTokenService;
        }

        public async Task<AuthResponse> LoginAsync(string email, string password)
        {
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

    }

}
