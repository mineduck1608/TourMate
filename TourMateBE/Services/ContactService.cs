using Repositories.DTO.ResultModels;
using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface IContactService
    {
        Task<Contact> GetContact(int id);
        Task<PagedResult<Contact>> GetAll(int pageSize, int pageIndex);
        Task<bool> CreateContact(Contact contact);
        Task<bool> UpdateContact(Contact contact);
        bool DeleteContact(int id);
    }

    public class ContactService : IContactService
    {
        private ContactRepository ContactRepository { get; set; } = new();

        public async Task<Contact> GetContact(int id)
        {
            return await ContactRepository.GetByIdAsync(id);
        }

        public Task<PagedResult<Contact>> GetAll(int pageSize, int pageIndex)
        {
            return ContactRepository.GetAllPaged(pageSize, pageIndex);
        }

        public async Task<bool> CreateContact(Contact contact)
        {
            return await ContactRepository.CreateAsync(contact);
        }

        public async Task<bool> UpdateContact(Contact contact)
        {
            return await ContactRepository.UpdateAsync(contact);
        }

        public bool DeleteContact(int id)
        {
            ContactRepository.Remove(id);
            return true;
        }
    }
}