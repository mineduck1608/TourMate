using Repositories.Models;
using Repositories.GenericRepository;
using Microsoft.EntityFrameworkCore;

namespace Repositories.Repository
{
    public class AccountRepository : GenericRepository<Account>
    {
        public AccountRepository()
        {
        }

        public async Task<Account> GetAccountByLogin(string email, string password)
        {
            return await _context.Accounts.Include(a => a.Role).FirstOrDefaultAsync(a => a.Email == email && a.Password == password);
        }

        public async Task<Account> GetAccountByEmail(string email)
        {
            return await _context.Accounts.Include(a => a.Role).FirstOrDefaultAsync(a => a.Email == email);
        }
    }
}