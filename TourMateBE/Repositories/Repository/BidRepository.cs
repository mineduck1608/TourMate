using Repositories.Models;
using Repositories.GenericRepository;
using Repositories.DTO;
using Microsoft.EntityFrameworkCore;

namespace Repositories.Repository
{
    public class BidRepository : GenericRepository<Bid>
    {
        public async Task<PagedResult<Bid>> GetBidsOfTourBid(int tourBid, int pageSize, int pageIndex)
        {
            var query = _context.Bids
                .Where(x => x.TourBidId == tourBid)
                .OrderByDescending(x => x.CreatedAt)
                .AsQueryable();
            var totalItems = await query.CountAsync();
            var result = await query
                .Skip(pageSize * (pageIndex - 1))
                .Take(pageSize)
                .Include(x => x.TourGuide)
                .ToListAsync();
            return new PagedResult<Bid>
            {
                Result = result,
                TotalResult = totalItems,
                TotalPage = (int)Math.Ceiling((double)totalItems / pageSize)
            };
        }
    }
}