using Repositories.Context;
using Repositories.GenericRepository;
using Repositories.IRepositories;
using Repositories.Models;

namespace Repositories.Repositories
{
    public class AccountMembershipRepository : GenericRepository<AccountMembership>, IAccountMembershipRepository
    {
        public AccountMembershipRepository(TourmateContext context) : base(context) { }
    }
}
