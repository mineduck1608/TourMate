using Repositories.GenericRepository;
using Repositories.Models;

namespace Repositories.IRepositories
{
    public interface IMembershipPackagesRepository : IGenericRepository<MembershipPackage>
    {
        Task<MembershipPackage?> GetNearestPackageForAccount(int accountId);
    }
}
