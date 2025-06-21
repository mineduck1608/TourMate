using Repositories.Models;
using Repositories.ResponseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface IContactService
    {
        Task<Contact> GetContact(int id);
        Task<PagedResult<Contact>> GetAll(int pageSize, int pageIndex);
        Task<bool> CreateContact(Contact contact);
        Task<bool> UpdateContact(Contact contact);
        bool DeleteContact(int id);
    }
}
