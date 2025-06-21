using Repositories.GenericRepository;
using Repositories.Models;
using Repositories.ResponseModels;

namespace Repositories.IRepositories
{
    public interface ICustomerRepository : IGenericRepository<Customer>
    {
        Task<Customer> GetByAccId(int accId);
        Task<Customer> GetByPhone(string phone);
        Task<PagedResult<Customer>> FilterByPhone(int pageSize, int pageIndex, string phone);
        Task<Customer> GetCustomerFromAccount(int accountId);
        Task<Customer> GetCustomerById(int customerId);
    }
}
