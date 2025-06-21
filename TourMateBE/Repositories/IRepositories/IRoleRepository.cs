using Repositories.GenericRepository;
using Repositories.Models;

namespace Repositories.IRepositories
{
    public interface IRoleRepository : IGenericRepository<Role>
    {
        // Nếu cần thêm các method riêng thì khai báo ở đây
    }
}
