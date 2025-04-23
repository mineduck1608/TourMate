using Repositories.Models;
using Repositories.GenericRepository;
using Microsoft.EntityFrameworkCore;

namespace Repositories.Repository
{
    public class TourGuideRepository : GenericRepository<TourGuide>
    {
        public TourGuideRepository()
        {
        }

        public async Task<TourGuide> GetByAccId(int accId)
        {
            return await _context.TourGuides.FirstOrDefaultAsync(x => x.AccountId == accId);
        }
    }
}