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

        public async Task RemoveToken(string token)
        {
            var result = await _context.RefreshTokens.FirstOrDefaultAsync(t => t.Token == token);
            if (result != null)
            {
                _context.RefreshTokens.Remove(result);  // xóa entity khỏi DbSet
                await _context.SaveChangesAsync();
            }
        }
    }
}