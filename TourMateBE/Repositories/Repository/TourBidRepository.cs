using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using Repositories.DTO;
using Repositories.GenericRepository;
using Repositories.Models;

namespace Repositories.Repository
{
    public class TourBidRepository : GenericRepository<TourBid>
    {
        public async Task<PagedResult<TourBid>> GetBids(int? areaId, int pageSize, int pageIndex)
        {
            var query = _context.TourBids
                .Where(x => !areaId.HasValue || x.PlaceRequested == areaId)
                .OrderByDescending(x => x.CreatedAt)
                .AsQueryable();
            var totalItems = await query.CountAsync();
            var result = await query
                .Skip(pageSize * (pageIndex - 1))
                .Take(pageSize)
                .Include(x => x.PlaceRequestedNavigation)
                .Include(x => x.Account)
                .ThenInclude(x => x.Customers)
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
                .AsQueryable();
            var totalItems = await query.CountAsync();
            var result = await query
                .Skip(pageSize * (pageIndex - 1))
                .Take(pageSize)
                .Include(x => x.PlaceRequestedNavigation)
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