using Repositories.Models;
using Repositories.GenericRepository;
using Microsoft.EntityFrameworkCore;
using Repositories.DTO;

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

        public async Task<TourGuide> GetById(int id)
        {
            try
            {
                return await _context.TourGuides
                    .Include(x => x.TourGuideDescs)
                    .ThenInclude(x => x.Area)
                    .Include(x => x.TourServices)
                    .FirstOrDefaultAsync(x => x.TourGuideId == id);
            }
            catch (Exception ex)
            {
            }
            return null;
        }

        public async Task<PagedResult<TourGuide>> GetAllPaged(int pageSize, int pageIndex, bool descending = true)
        {
            var query = _context.TourGuides
                .Include (x => x.TourGuideDescs)
                .ThenInclude(x => x.Area)
                .AsQueryable();

            // Phân trang
            var result = await query
                .Skip(pageSize * (pageIndex - 1))
                .Take(pageSize)
                .ToListAsync();

            // Lấy tổng số bản ghi
            var totalAmount = await _context.TourGuides.CountAsync();

            return new PagedResult<TourGuide>
            {
                Result = result,
                TotalResult = totalAmount,
                TotalPage = totalAmount / pageSize + (totalAmount % pageSize != 0 ? 1 : 0)
            };
        }

    }
}