using Repositories.Models;
using Repositories.GenericRepository;
using Microsoft.EntityFrameworkCore;

namespace Repositories.Repository
{
    public class MembershipPackagesRepository : GenericRepository<MembershipPackage>
    {
        public async Task<MembershipPackage> GetNearestPackageForAccount(int id)
        {
            var result = _context.AccountMemberships
                .Where(x => x.AccountId == id && x.IsActive)
                .Include(x => x.MembershipPackage)
                ;
            if (result.Any())
            {
                var accMembership = await result.FirstAsync();
                return accMembership.MembershipPackage;
            }
            return null;
        }
    }
}