using Repositories.Models;
using Repositories.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public interface IRefreshTokenService
    {

    }

    public class RefreshTokenService : IRefreshTokenService
    {
        private readonly RefreshTokenRepository _repository;

        public RefreshTokenService(RefreshTokenRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        public async Task<RefreshToken> GetByRefreshToken(string refreshToken)
        {
            return await _repository.GetByTokenAsync(refreshToken);
        }
    }
}
