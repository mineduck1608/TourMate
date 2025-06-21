using Repositories.GenericRepository;
using Repositories.Models;

namespace Repositories.IRepositories
{
    public interface IPaymentsRepository : IGenericRepository<Payment>
    {
        Task<List<Payment>> GetByAccountId(int accountId);
    }
}
