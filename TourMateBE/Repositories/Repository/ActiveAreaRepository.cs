using Repositories.Models;
using Repositories.GenericRepository;
using Microsoft.EntityFrameworkCore;
using Repositories.DTO;

namespace Repositories.Repository
{
    public class ActiveAreaRepository : GenericRepository<ActiveArea>
    {
        // Trả về ActiveAreas với bộ lọc theo search và region
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
    }
}