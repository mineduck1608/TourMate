using Repositories.Models;
using Repositories.IRepositories;
using Repositories.ResponseModels;
using Services.IServices;

namespace Services.Services
{
    public class ContactService : IContactService
    {
        private IContactRepository ContactRepository;

        public ContactService(IContactRepository contactRepository)
        {
            ContactRepository = contactRepository ?? throw new ArgumentNullException(nameof(contactRepository));
        }
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