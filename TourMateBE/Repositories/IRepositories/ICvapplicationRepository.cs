using Repositories.GenericRepository;
using Repositories.Models;

namespace Repositories.IRepositories
{
    public interface ICvapplicationRepository : IGenericRepository<Cvapplication>
    {
        // Sau này bạn có thể thêm các phương thức như:
        // Task<List<Cvapplication>> GetByAccountIdAsync(int accountId);
    }
}
