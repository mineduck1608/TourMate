using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface IContactService
    {
        Contact GetContact(int id);
        IEnumerable<Contact> GetAll(int pageSize, int pageIndex);
        void CreateContact(Contact contact);
        void UpdateContact(Contact contact);
        bool DeleteContact(int id);
    }

    public class ContactService : IContactService
    {
        private ContactRepository ContactRepository { get; set; } = new();

        public Contact GetContact(int id)
        {
            return ContactRepository.GetById(id);
        }

        public IEnumerable<Contact> GetAll(int pageSize, int pageIndex)
        {
            return ContactRepository.GetAll(pageSize, pageIndex);
        }

        public void CreateContact(Contact contact)
        {
            ContactRepository.Create(contact);
        }

        public void UpdateContact(Contact contact)
        {
            ContactRepository.Update(contact);
        }

        public bool DeleteContact(int id)
        {
            ContactRepository.Remove(id);
            return true;
        }
    }
}