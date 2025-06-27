using Repositories.Context;
using Repositories.GenericRepository;
using Repositories.IRepositories;
using Repositories.Models;

namespace Repositories.Repositories
{
    public class AccountMembershipRepository : GenericRepository<AccountMembership>, IAccountMembershipRepository
    {
        public AccountMembershipRepository(TourmateContext context) : base(context) { }
        public async Task<bool> DeactivateMembership()
        {
            try
            {
                var current = DateOnly.FromDateTime(DateTime.UtcNow);
                var expiredMemberships = _context.AccountMemberships.Where(x =>
                x.EndDate <= current && x.IsActive
                );
                foreach (var item in expiredMemberships)
                {
                    item.IsActive = false;
                }
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
