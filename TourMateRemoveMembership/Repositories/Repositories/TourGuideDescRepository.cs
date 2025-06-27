using Repositories.Context;
using Repositories.GenericRepository;
using Repositories.IRepositories;
using Repositories.Models;

namespace Repositories.Repositories
{
    public class TourGuideDescRepository : GenericRepository<TourGuideDesc>, ITourGuideDescRepository
    {
        public TourGuideDescRepository(TourmateContext context) : base(context)
        {
        }
    }
}