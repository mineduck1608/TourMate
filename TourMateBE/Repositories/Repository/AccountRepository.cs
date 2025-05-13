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

        public async Task<Account> CreateAdmin(Account entity)
        {
            try
            {
                _context.Add(entity);

                await _context.SaveChangesAsync();

                return entity;
            }
            catch (Exception ex)
            {
                // Bạn có thể log lỗi hoặc trả về null nếu có lỗi
                return null;
            }
        }
    }
}