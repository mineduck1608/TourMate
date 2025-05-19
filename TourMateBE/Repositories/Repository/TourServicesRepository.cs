using Repositories.Models;
using Repositories.GenericRepository;
using Repositories.DTO;
using Microsoft.EntityFrameworkCore;

namespace Repositories.Repository
{
    public class TourServicesRepository : GenericRepository<TourService>
    {
        public async Task<PagedResult<TourService>> GetTourServicesOf(int tourGuideId, int pageSize, int pageIndex)
        {
            var query = _context.TourServices.Where(x => x.TourGuideId == tourGuideId);

            // Phân trang
            var result = await query
                .Skip(pageSize * (pageIndex - 1))
                .Take(pageSize)
                .ToListAsync();

            // Lấy tổng số bản ghi
            var totalAmount = await query.CountAsync();

            return new()
            {
                Result = result,
                TotalResult = totalAmount,
                TotalPage = totalAmount / pageSize + (totalAmount % pageSize != 0 ? 1 : 0)
            };
        }
    }
}