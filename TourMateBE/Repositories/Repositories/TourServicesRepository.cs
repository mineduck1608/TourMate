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

        public async Task<List<TourService>> GetOtherTourServicesAsync(int tourGuideId, int serviceId, int pageSize)
        {
            // Truy vấn dữ liệu từ cơ sở dữ liệu, loại bỏ serviceId hiện tại và lấy dữ liệu ngẫu nhiên
            var query = _context.TourServices
                                .Where(x => x.TourGuideId == tourGuideId && x.ServiceId != serviceId)
                                .OrderBy(x => Guid.NewGuid())  // Sắp xếp ngẫu nhiên
                                .AsQueryable();

            var result = await query
                .Take(pageSize)  // Giới hạn số lượng kết quả theo pageSize
                .ToListAsync();

            return result;
        }
        public new async Task<bool> RemoveAsync(int id)
        {
            var v = _context.TourServices.FirstOrDefault(x => x.ServiceId == id);
            v.IsDeleted = true;
            _context.TourServices.Update(v);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}