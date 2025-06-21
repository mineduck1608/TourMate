using Repositories.Context;
using Repositories.GenericRepository;
using Repositories.IRepositories;
using Repositories.Models;

namespace Repositories.Repositories
{
    public class SystemRevenueRepository : GenericRepository<SystemRevenue>, ISystemRevenueRepository
    {
        public SystemRevenueRepository(TourmateContext context) : base(context)
        {
        }
    }
}
