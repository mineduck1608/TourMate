using Microsoft.EntityFrameworkCore;
using Repositories.Context;
using Repositories.GenericRepository;
using Repositories.IRepositories;
using Repositories.Models;
using Repositories.ResponseModels;

namespace Repositories.Repositories
{
    public class ActiveAreaRepository : GenericRepository<ActiveArea>, IActiveAreaRepository
    {
        public ActiveAreaRepository(TourmateContext context) : base(context) { }

        public async Task<PagedResult<ActiveArea>> GetActiveAreas(string search, string region, int page, int limit)
        {
            var query = _context.ActiveAreas.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(a => a.AreaName.Contains(search));
            }

            if (!string.IsNullOrEmpty(region))
            {
                query = query.Where(a => a.AreaType == region);
            }

            var totalItems = await query.CountAsync();

            var activeAreas = await query
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            return new PagedResult<ActiveArea>
            {
                Result = activeAreas,
                TotalResult = totalItems,
                TotalPage = (int)Math.Ceiling((double)totalItems / limit)
            };
        }

        public async Task<IEnumerable<SimplifiedAreaListResult>> GetSimplifiedActiveAreas()
        {
            return _context.ActiveAreas.Select(x => new SimplifiedAreaListResult()
            {
                AreaId = x.AreaId,
                AreaName = x.AreaName,
            }).OrderByDescending(a => a.AreaName);
        }


        public async Task<IEnumerable<MostPopularArea>> GetMostPopularAreas()
        {
            return _context.ActiveAreas
                .Include(x => x.TourBids)
                .OrderByDescending(x => x.TourBids.Count(t => !t.IsDeleted))
                .Select(x => new MostPopularArea()
                {
                    AreaId = x.AreaId,
                    AreaName = x.AreaName,
                    TourBidCount = x.TourBids.Count(t => !t.IsDeleted) // Only count non-deleted bids
                })
                .Where(x => x.TourBidCount != 0);
        }

        public async Task<List<ActiveArea>> GetRandomActiveAreaAsync(int size)
        {
            var query = _context.ActiveAreas
                                .OrderBy(x => Guid.NewGuid())  // Sắp xếp ngẫu nhiên
                                .AsQueryable();

            var result = await query
                .Take(size)  // Giới hạn số lượng kết quả theo pageSize
                .ToListAsync();

            return result;
        }

        public async Task<List<ActiveArea>> GetOtherActiveAreaAsync(int currentId, int size)
        {
            var query = _context.ActiveAreas.Where(c => c.AreaId != currentId)
                                .OrderBy(x => Guid.NewGuid())  // Sắp xếp ngẫu nhiên
                                .AsQueryable();

            var result = await query
                .Take(size)  // Giới hạn số lượng kết quả theo pageSize
                .ToListAsync();

            return result;
        }
    }
}