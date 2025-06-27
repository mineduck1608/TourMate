using Repositories.Models;
using Repositories.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Services.IServices;

namespace Services.Services
{
    public class RefreshTokenService : IRefreshTokenService
    {
        private readonly IRefreshTokenRepository _repository;

        public RefreshTokenService(IRefreshTokenRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        public async Task<RefreshToken> GetByRefreshToken(string refreshToken)
        {
            return await _repository.GetByTokenAsync(refreshToken);
        }

        public IEnumerable<RefreshToken> GetAll(int pageSize, int pageIndex)
        {
            return _repository.GetAll(pageSize, pageIndex);
        }

        public void CreateRefreshToken(RefreshToken refreshtoken)
        {
            _repository.Create(refreshtoken);
        }

        public async Task<bool> UpdateRefreshToken(RefreshToken refreshtoken)
        {
            return await _repository.UpdateAsync(refreshtoken);
        }

        public bool DeleteRefreshToken(int id)
        {
            _repository.Remove(id);
            return true;
        }
    }
}
