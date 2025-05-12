using Repositories.Models;
using Repositories.GenericRepository;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Repositories.DTO;
using Azure;
using System.Collections.Generic;

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

        public async Task<PagedResult<Customer>> FilterByEmailAndPhone(int pageSize, int pageIndex, string email, string phone)
        {
            var query = _context.Customers.Include(a => a.Account).AsQueryable();

            if (!string.IsNullOrEmpty(email))
            {
                query = query.Where(a => a.Account.Email.ToLower().Contains(email.ToLower()));
            }

            if (!string.IsNullOrEmpty(phone))
            {
                query = query.Where(a => a.Phone == phone);
            }

            var totalItems = await query.CountAsync();
            var data = await query
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<Customer>
            {
                Result = data,
                TotalResult = totalItems,
                TotalPage = (int)Math.Ceiling((double)totalItems / pageSize)
            };
        }
    }
}