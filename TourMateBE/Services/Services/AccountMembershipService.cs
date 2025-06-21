using Repositories.IRepositories;
using Repositories.Models;
using Services.IServices;

namespace Services.Services
{
    public class AccountMembershipService : IAccountMembershipService
    {
        private readonly IAccountMembershipRepository _accountMembershipRepository;

        public AccountMembershipService(IAccountMembershipRepository accountMembershipRepository)
        {
            _accountMembershipRepository = accountMembershipRepository;
        }

        public AccountMembership GetAccountMembership(int id)
        {
            return _accountMembershipRepository.GetById(id);
        }

        public IEnumerable<AccountMembership> GetAll(int pageSize, int pageIndex)
        {
            return _accountMembershipRepository.GetAll(pageSize, pageIndex);
        }

        public async Task<bool> CreateAccountMembership(AccountMembership accountMembership)
        {
            return await _accountMembershipRepository.CreateAsync(accountMembership);
        }

        public async Task<bool> UpdateAccountMembership(AccountMembership accountMembership)
        {
            return await _accountMembershipRepository.UpdateAsync(accountMembership);
        }

        public async Task<bool> DeleteAccountMembership(int id)
        {
            return await _accountMembershipRepository.RemoveAsync(id);
        }
    }
}
