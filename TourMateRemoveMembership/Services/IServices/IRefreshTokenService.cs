using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface IRefreshTokenService
    {
        Task<RefreshToken> GetByRefreshToken(string refreshToken);
        IEnumerable<RefreshToken> GetAll(int pageSize, int pageIndex);
        void CreateRefreshToken(RefreshToken refreshtoken);
        Task<bool> UpdateRefreshToken(RefreshToken refreshtoken);
        bool DeleteRefreshToken(int id);
    }
}
