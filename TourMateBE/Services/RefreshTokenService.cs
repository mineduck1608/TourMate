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
        Task<RefreshToken> GetByRefreshToken(string refreshToken);
        IEnumerable<RefreshToken> GetAll(int pageSize, int pageIndex);
        void CreateRefreshToken(RefreshToken refreshtoken);
        void UpdateRefreshToken(RefreshToken refreshtoken);
        bool DeleteRefreshToken(int id);
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

        public IEnumerable<RefreshToken> GetAll(int pageSize, int pageIndex)
        {
            return _repository.GetAll(pageSize, pageIndex);
        }

        public void CreateRefreshToken(RefreshToken refreshtoken)
        {
            _repository.Create(refreshtoken);
        }

        public void UpdateRefreshToken(RefreshToken refreshtoken)
        {
            _repository.Update(refreshtoken);
        }

        public bool DeleteRefreshToken(int id)
        {
            _repository.Remove(id);
            return true;
        }
    }
}
