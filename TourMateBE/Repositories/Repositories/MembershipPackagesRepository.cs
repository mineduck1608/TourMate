using Microsoft.EntityFrameworkCore;
using Repositories.Context;
using Repositories.GenericRepository;
using Repositories.Models;
using Repositories.IRepositories;

namespace Repositories.Repositories
{
    public class MembershipPackagesRepository : GenericRepository<MembershipPackage>, IMembershipPackagesRepository
    {
        public MembershipPackagesRepository(TourmateContext context) : base(context)
        {
        }

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