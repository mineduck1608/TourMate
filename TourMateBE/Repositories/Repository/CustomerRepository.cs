using Repositories.Models;
using Repositories.GenericRepository;
using Microsoft.EntityFrameworkCore;

namespace Repositories.Repository
{
    public class CustomerRepository : GenericRepository<Customer>
    {
        public CustomerRepository()
        {
        }

        public async Task<Customer> GetByAccId(int accId)
        {
            return await _context.Customers.FirstOrDefaultAsync(x => x.AccountId == accId);
        }
        public async Task<Customer> GetByPhone(string phone)
        {
            return await _context.Customers.FirstOrDefaultAsync(x => x.Phone == phone);
        }
    }
}