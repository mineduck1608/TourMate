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

        public TokenService(IConfiguration config, RefreshTokenRepository refreshTokenRepo)
        {
            _config = config;
            _refreshTokenRepo = refreshTokenRepo;
        }

        public string GenerateAccessToken(int accountId, string fullName, string roleName)
        {
            // Lấy khóa bảo mật từ cấu hình
            var key = _config["Jwt:Key"];
            if (string.IsNullOrEmpty(key))
                throw new InvalidOperationException("Jwt:Key is missing.");

            // Kiểm tra và parse thời gian hết hạn token (phút)
            if (!int.TryParse(_config["Jwt:ExpireTime"], out var expireMinutes) || expireMinutes <= 0)
                throw new InvalidOperationException("Jwt:ExpireTime is invalid.");


            var claims = new[]
            {
                new Claim("AccountId", accountId.ToString()),
                new Claim("FullName", fullName),
                new Claim(ClaimTypes.Role, roleName),
            };

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var creds = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(5),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<string> GenerateAndSaveRefreshTokenAsync(int userId)
        {
            var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

            var tokenModel = new RefreshToken
            {
                Token = refreshToken,
                ExpireAt = DateTime.UtcNow.AddDays(7),
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

            string username = "dummy"; 
            string roleName = "dummy"; 


            var newAccessToken = GenerateAccessToken(userId, username, roleName);
            var newRefreshToken = await GenerateAndSaveRefreshTokenAsync(userId);

            return (newAccessToken, newRefreshToken);
        }
    }
}
