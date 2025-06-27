using Repositories.Models;
using Repositories.ResponseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface ICustomerService
    {
        Task<Customer> GetCustomerByAccId(int accId);
        Task<Customer> GetCustomer(int id);
        Task<bool> CreateCustomer(Customer customer);
        Task<bool> UpdateCustomer(Customer customer);
        bool DeleteCustomer(int id);
        Task<Customer> GetCustomerByPhone(string phone);
        Task<PagedResult<Customer>> GetAll(int pageSize, int pageIndex, string phone);
        Task<Customer> GetCustomerFromAccount(int accountId);
    }
}
