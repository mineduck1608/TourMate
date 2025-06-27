using Repositories.Context;
using Repositories.GenericRepository;
using Repositories.IRepositories;
using Repositories.Models;

namespace Repositories.Repositories
{
    public class CvapplicationRepository : GenericRepository<Cvapplication>, ICvapplicationRepository
    {
        public CvapplicationRepository(TourmateContext context) : base(context)
        {
        }
    }
}