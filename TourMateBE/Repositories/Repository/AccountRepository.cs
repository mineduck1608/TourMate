﻿using Repositories.Models;
using Repositories.DTO;
using Repositories.GenericRepository;
using Microsoft.EntityFrameworkCore;

namespace Repositories.Repository
{
    public class AccountRepository : GenericRepository<Account>
    {
        public AccountRepository()
        {
        }

        public async Task<List<AccountSearchResult>> SearchAccountsByNameAsync(string searchTerm, int excludeUserId)
        {
            searchTerm = searchTerm?.ToLower() ?? "";

            // Query Customers có tên phù hợp
            var customersQuery = from a in _context.Accounts
                                 join c in _context.Customers on a.AccountId equals c.AccountId
                                 where a.AccountId != excludeUserId
                                       && a.RoleId == 2
                                       && c.FullName.ToLower().Contains(searchTerm)
                                 select new AccountSearchResult
                                 {
                                     AccountId = a.AccountId,
                                     FullName = c.FullName,
                                     RoleId = a.RoleId
                                 };

            // Query TourGuides có tên phù hợp
            var guidesQuery = from a in _context.Accounts
                              join g in _context.TourGuides on a.AccountId equals g.AccountId
                              where a.AccountId != excludeUserId
                                    && a.RoleId == 3
                                    && g.FullName.ToLower().Contains(searchTerm)
                              select new AccountSearchResult
                              {
                                  AccountId = a.AccountId,
                                  FullName = g.FullName,
                                  RoleId = a.RoleId
                              };

            // Union kết quả 2 bảng
            var result = await customersQuery
                .Union(guidesQuery)
                .ToListAsync();

            return result;
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
                entity.Role = null;
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

        public async Task<bool> LockAccount(int id)
        {
            try
            {
                var account = await _context.Accounts.FirstOrDefaultAsync(a => a.AccountId == id);
                if (account == null)
                {
                    return false; // Không tìm thấy tài khoản
                }

                if (!account.Status)
                {
                    return true; // Tài khoản đã bị khóa trước đó
                }

                account.Status = false;
                _context.Entry(account).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                // Ghi log nếu cần: _logger.LogError(ex, "Failed to lock account.");
                return false;
            }
        }


        public async Task<bool> UnlockAccount(int id)
        {
            try
            {
                var account = await _context.Accounts.FirstOrDefaultAsync(a => a.AccountId == id);
                if (account == null)
                {
                    return false; // Không tìm thấy tài khoản
                }

                if (account.Status)
                {
                    return true;
                }

                account.Status = true;
                _context.Entry(account).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                // Ghi log nếu cần: _logger.LogError(ex, "Failed to lock account.");
                return false;
            }
        }

    }
}