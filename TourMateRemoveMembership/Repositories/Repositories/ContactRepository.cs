using Repositories.Context;
using Repositories.GenericRepository;
using Repositories.IRepositories;
using Repositories.Models;

namespace Repositories.Repositories
{
    public class ContactRepository : GenericRepository<Contact>, IContactRepository
    {
        public ContactRepository(TourmateContext context) : base(context)
        {
        }
    }
}
