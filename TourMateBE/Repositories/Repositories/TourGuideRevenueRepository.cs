using Repositories.Context;
using Repositories.GenericRepository;
using Repositories.IRepositories;
using Repositories.Models;

namespace Repositories.Repositories
{
    public class TourGuideRevenueRepository
       : GenericRepository<TourGuideRevenue>, ITourGuideRevenueRepository
    {
        public TourGuideRevenueRepository(TourmateContext context) : base(context)
        {
        }
    }

}