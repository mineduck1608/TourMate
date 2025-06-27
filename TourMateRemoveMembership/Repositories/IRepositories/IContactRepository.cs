using Repositories.GenericRepository;
using Repositories.Models;

namespace Repositories.IRepositories
{
    public interface IContactRepository : IGenericRepository<Contact>
    {
        // Nếu sau này cần thêm method đặc biệt, khai báo ở đây
    }
}
