using Repositories.DTO;
using Repositories.Models;
using Repositories.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public interface ICustomerService
    {
        Task<Customer> GetCustomerByAccId(int accId);
        Customer GetCustomer(int id);
        Task<bool> CreateCustomer(Customer customer);
        Task<bool> UpdateCustomer(Customer customer);
        bool DeleteCustomer(int id);
        Task<Customer> GetCustomerByPhone(string phone);
        Task<PagedResult<Customer>> GetAll(int pageSize, int pageIndex, string phone);
        Task<Customer> GetCustomerFromAccount(int accountId);
    }
    public class CustomerService : ICustomerService
    {
        private readonly CustomerRepository _repository;

        public CustomerService(CustomerRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        public async Task<Customer> GetCustomerByAccId(int accId)
        {
            return await _repository.GetByAccId(accId);
        }

        public async Task<Customer> GetCustomerByPhone(string phone)
        {
            return await _repository.GetByPhone(phone);
        }

        public Customer GetCustomer(int id)
        {
            return _repository.GetById(id);
        }

        public async Task<PagedResult<Customer>> GetAll(int pageSize, int pageIndex, string phone)
        {
            return await _repository.FilterByPhone(pageSize, pageIndex, phone);
        }

        public async Task<bool> CreateCustomer(Customer customer)
        {
            return await _repository.CreateAsync(customer);
        }

        public async Task<bool> UpdateCustomer(Customer customer)
        {
           return await _repository.UpdateAsync(customer);
        }

        public bool DeleteCustomer(int id)
        {
            _repository.Remove(id);
            return true;
        }

        public Task<Customer> GetCustomerFromAccount(int accountId)
        {
            return _repository.GetCustomerFromAccount(accountId);
        }
    }
}
