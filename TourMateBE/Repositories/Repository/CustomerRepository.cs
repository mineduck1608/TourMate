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

        public async Task<PagedResult<Customer>> FilterByPhone(int pageSize, int pageIndex, string phone)
        {
            var query = _context.Customers.AsQueryable();


            // Lọc theo số điện thoại nếu có
            if (!string.IsNullOrEmpty(phone))
            {
                query = query.Where(c => c.Phone != null && c.Phone.Contains(phone));
            }


            // Đếm tổng số bản ghi sau khi áp dụng bộ lọc
            var totalItems = await query.CountAsync();

            // Truy vấn dữ liệu phân trang, chỉ lấy các trường cần thiết từ Account
            var data = await query
                .Skip((pageIndex - 1) * pageSize)  // Phân trang: bỏ qua các bản ghi trước
                .Take(pageSize)                    // Lấy số lượng bản ghi cần thiết
                .Select(c => new Customer
                {
                    CustomerId = c.CustomerId,
                    FullName = c.FullName,
                    AccountId = c.AccountId,
                    Gender = c.Gender,
                    DateOfBirth = c.DateOfBirth,
                    Phone = c.Phone,
                    Image = c.Image,
                    // Chỉ lấy các trường cần thiết từ Account
                    Account = new Account
                    {
                        AccountId = c.Account.AccountId,
                        Email = c.Account.Email,
                        Password = c.Account.Password,
                        CreatedDate = c.Account.CreatedDate,
                        Status = c.Account.Status,
                        Role = c.Account.Role
                    }
                })
                .ToListAsync();

            // Tạo kết quả phân trang và trả về
            return new PagedResult<Customer>
            {
                Result = data,
                TotalResult = totalItems,
                TotalPage = (int)Math.Ceiling((double)totalItems / pageSize)
            };
        }

        public async Task<Customer> GetCustomerFromAccount(int accountId)
        {
            var customer = await _context.Customers
                .Include(c => c.Account) // Bao gồm thông tin tài khoản
                .FirstOrDefaultAsync(c => c.AccountId == accountId);
            return customer;
        }
    }
}