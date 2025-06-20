using Microsoft.IdentityModel.Tokens;
using Repositories.Models;
using Repositories.Repository;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;


namespace Services.Utils
{
    public class TokenService
    {
        private readonly IConfiguration _config;
        private readonly RefreshTokenRepository _refreshTokenRepo;
        private readonly AccountRepository _accountRepository;

        public TokenService(IConfiguration config, RefreshTokenRepository refreshTokenRepo, AccountRepository accountRepository)
        {
            _config = config;
            _refreshTokenRepo = refreshTokenRepo;
            _accountRepository = accountRepository;
        }

        public string GenerateAccessToken(int accountId, string fullName, string roleName)
        {
            // Lấy khóa bảo mật từ cấu hình
            var key = _config["Jwt:Key"];
            if (string.IsNullOrEmpty(key))
                throw new InvalidOperationException("Jwt:Key is missing.");

            // Kiểm tra và parse thời gian hết hạn token (phút)
            if (!int.TryParse(_config["Jwt:AccessTokenExpireMinutes"], out var accessExpireMinutes) || accessExpireMinutes <= 0)
                accessExpireMinutes = 10;


            var claims = new[]
            {
                new Claim("AccountId", accountId.ToString()),
                new Claim("FullName", fullName),
                new Claim("Role", roleName),
            };

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var creds = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);



            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(accessExpireMinutes),
                signingCredentials: creds);


            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<string> GenerateAndSaveRefreshTokenAsync(int userId)
        {
            var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

            if (!int.TryParse(_config["Jwt:RefreshTokenExpireDays"], out var refreshExpireDays) || refreshExpireDays <= 0)
                refreshExpireDays = 7;

            var tokenModel = new RefreshToken
            {
                Id = Guid.NewGuid(),
                Token = refreshToken,
                ExpireAt = DateTime.UtcNow.AddDays(refreshExpireDays),
                IsRevoked = false,
                CreatedAt = DateTime.UtcNow,
                UserId = userId
            };


            await _refreshTokenRepo.SaveAsync(tokenModel);
            return refreshToken;
        }

        public async Task<(string accessToken, string refreshToken)?> RefreshTokensAsync(string oldRefreshToken)
        {
            var tokenInDb = await _refreshTokenRepo.GetByTokenAsync(oldRefreshToken);
            if (tokenInDb == null) return null;

            await _refreshTokenRepo.RevokeAsync(tokenInDb);

            int userId = tokenInDb.UserId;

            // Lấy thông tin user
            var user = await _accountRepository.GetByIdAsync(tokenInDb.UserId);
            if (user == null) return null;

            string fullName = user.Role?.RoleName switch
            {
                "Customer" => user.Customers?.FirstOrDefault()?.FullName,
                "TourGuide" => user.TourGuides?.FirstOrDefault()?.FullName,
                "Admin" => "Admin",
                _ => null
            } ?? user.Email ?? "Unknown";

            string roleName = user.Role?.RoleName ?? "Unknown";

            var newAccessToken = GenerateAccessToken(userId, fullName, roleName);
            await _refreshTokenRepo.RemoveToken(oldRefreshToken);
            var newRefreshToken = await GenerateAndSaveRefreshTokenAsync(userId);

            return (newAccessToken, newRefreshToken);
        }

        public string GenerateResetPasswordToken(Account user)
        {
            var key = _config["Jwt:ResetPasswordSecret"];
            if (string.IsNullOrEmpty(key))
                throw new InvalidOperationException("Jwt:Key is missing.");
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var creds = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
            new Claim("AccountId", user.AccountId.ToString()),
            new Claim("Email", user.Email),
        };

            var token = new JwtSecurityToken(
                issuer: null,
                audience: null,
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public ClaimsPrincipal? ValidateResetPasswordToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = _config["Jwt:ResetPasswordSecret"];
            if (string.IsNullOrEmpty(key))
                throw new InvalidOperationException("Jwt:Key is missing.");
            var encodedKey = Encoding.UTF8.GetBytes(key);

            try
            {
                var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    IssuerSigningKey = new SymmetricSecurityKey(encodedKey),
                    ValidateIssuerSigningKey = true,
                    ClockSkew = TimeSpan.Zero,
                }, out SecurityToken validatedToken);

                return principal;
            }
            catch
            {
                return null;
            }
        }
    }
}
