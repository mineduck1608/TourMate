using Repositories.Models;
using Repositories.ResponseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface IAccountService
    {
        Task<Account> GetAccount(int id);
        IEnumerable<Account> GetAll(int pageSize, int pageIndex);
        Task<bool> UpdateAccount(Account account);
        bool DeleteAccount(int id);
        Task<AuthResponse> LoginAsync(string email, string password);
        Task<AuthResponse> RefreshNewTokenAsync(string refreshToken);
        Task<Account> GetAccountByEmail(string email);
        Task<Account> CreateAccount(Account account);
        Task<Account> CreateAccountAdmin(Account account);
        Task<bool> LockAccount(int id);
        Task<bool> UnlockAccount(int id);
        Task<bool> RequestPasswordResetAsync(string email);
        Task<bool> ResetPasswordAsync(string token, string newPassword);
        Task<Account?> GetByAccountAndRoleAsync(int id, string role);
        Task<string> ChangePasswordAsync(int accountId, string currentPassword, string newPassword);
        Task<AuthResponse> GoogleLoginAsync(string email);
    }
}
