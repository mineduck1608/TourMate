using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface IAccountMembershipService
    {
        AccountMembership GetAccountMembership(int id);
        IEnumerable<AccountMembership> GetAll(int pageSize, int pageIndex);
        Task<bool> CreateAccountMembership(AccountMembership accountMembership);
        Task<bool> UpdateAccountMembership(AccountMembership accountMembership);
        Task<bool> DeleteAccountMembership(int id);


    }
}
