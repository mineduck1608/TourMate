using Repositories.Models;
using Repositories.IRepositories;
using Repositories.ResponseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Services.IServices;

namespace Services.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _repository;

        public CustomerService(ICustomerRepository repository)
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

        public async Task<Customer> GetCustomer(int id)
        {
            return await _repository.GetCustomerById(id);
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
