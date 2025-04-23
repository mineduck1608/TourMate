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
        IEnumerable<Customer> GetAll(int pageSize, int pageIndex);
        Task<bool> CreateCustomer(Customer customer);
        void UpdateCustomer(Customer customer);
        bool DeleteCustomer(int id);
        Task<Customer> GetCustomerByPhone(string phone);
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

        public IEnumerable<Customer> GetAll(int pageSize, int pageIndex)
        {
            return _repository.GetAll(pageSize, pageIndex);
        }

        public async Task<bool> CreateCustomer(Customer customer)
        {
            return await _repository.CreateAsync(customer);
        }

        public void UpdateCustomer(Customer customer)
        {
            _repository.Update(customer);
        }

        public bool DeleteCustomer(int id)
        {
            _repository.Remove(id);
            return true;
        }
    }
}
