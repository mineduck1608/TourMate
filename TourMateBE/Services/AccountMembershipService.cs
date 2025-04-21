using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface IAccountMembershipService
    {
        AccountMembership GetAccountMembership(int id);
        IEnumerable<AccountMembership> GetAll(int pageSize, int pageIndex);
        void CreateAccountMembership(AccountMembership accountmembership);
        void UpdateAccountMembership(AccountMembership accountmembership);
        bool DeleteAccountMembership(int id);
    }

    public class AccountMembershipService : IAccountMembershipService
    {
        private AccountMembershipRepository AccountMembershipRepository { get; set; } = new();

        public AccountMembership GetAccountMembership(int id)
        {
            return AccountMembershipRepository.GetById(id);
        }

        public IEnumerable<AccountMembership> GetAll(int pageSize, int pageIndex)
        {
            return AccountMembershipRepository.GetAll(pageSize, pageIndex);
        }

        public void CreateAccountMembership(AccountMembership accountmembership)
        {
            AccountMembershipRepository.Create(accountmembership);
        }

        public void UpdateAccountMembership(AccountMembership accountmembership)
        {
            AccountMembershipRepository.Update(accountmembership);
        }

        public bool DeleteAccountMembership(int id)
        {
            AccountMembershipRepository.Remove(id);
            return true;
        }
    }
}