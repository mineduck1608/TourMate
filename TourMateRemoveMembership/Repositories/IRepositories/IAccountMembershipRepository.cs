using Repositories.GenericRepository;
using Repositories.Models;

namespace Repositories.IRepositories
{
    public interface IAccountMembershipRepository : IGenericRepository<AccountMembership>
    {
        // Nếu có thêm phương thức đặc biệt, định nghĩa ở đây
        public Task<bool> DeactivateMembership();
    }
}
