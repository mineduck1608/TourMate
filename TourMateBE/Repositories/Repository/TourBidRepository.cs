using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using Repositories.DTO;
using Repositories.GenericRepository;
using Repositories.Models;

namespace Repositories.Repository
{
    public class TourBidRepository : GenericRepository<TourBid>
    {
        public async Task<PagedResult<TourBid>> GetBids(int pageSize, int pageIndex)
        {
            var query = _context.TourBids
                .OrderByDescending(x => x.CreatedAt)
                .Include(x => x.Account)
                .ThenInclude(x => x.Customers)
                .Include(x => x.Bids)
                .AsQueryable();
            var totalItems = await query.CountAsync();
            var result = await query
                .Skip(pageSize * (pageIndex - 1))
                .Take(pageSize)
                .ToListAsync();
            return new PagedResult<TourBid>
            {
                Result = result,
                TotalResult = totalItems,
                TotalPage = (int)Math.Ceiling((double)totalItems / pageSize)
            };
        }

        public async Task<PagedResult<TourBid>> GetBidsOf(int accountId, int pageSize, int pageIndex)
        {
            var query = _context.TourBids
                .Where(x => x.AccountId == accountId)
                .OrderByDescending(x => x.CreatedAt)
                .Include(x => x.Bids)
                .AsQueryable();
            var totalItems = await query.CountAsync();
            var result = await query
                .Skip(pageSize * (pageIndex - 1))
                .Take(pageSize)
                .ToListAsync();
            return new PagedResult<TourBid>
            {
                Result = result,
                TotalResult = totalItems,
                TotalPage = (int)Math.Ceiling((double)totalItems / pageSize)
            };
        }
    }
}