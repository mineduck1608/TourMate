using Repositories.Models;
using Repositories.GenericRepository;
using System;
using Repositories.Context;
using Microsoft.EntityFrameworkCore;

namespace Repositories.Repository
{
    public class RefreshTokenRepository : GenericRepository<RefreshToken>
    {

        public RefreshTokenRepository()
        {
        }

        public async Task SaveAsync(RefreshToken token)
        {
            _context.RefreshTokens.Add(token);
            await _context.SaveChangesAsync();
        }

        public async Task<RefreshToken?> GetByTokenAsync(string token)
        {
            return await _context.RefreshTokens
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Token == token && !r.IsRevoked);
        }

        public async Task RevokeAsync(RefreshToken token)
        {
            token.IsRevoked = true;
            await _context.SaveChangesAsync();
        }
    }
}