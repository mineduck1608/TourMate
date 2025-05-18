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

        public async Task<PagedResult<TourGuide>> FilterByEmailAndPhone(int pageSize, int pageIndex, string email, string phone)
        {
            var query = _context.TourGuides.AsQueryable();

            // Lọc theo email nếu có
            if (!string.IsNullOrEmpty(email))
            {
                query = query.Where(c => c.Account.Email.ToLower().Contains(email.ToLower()));
            }

            // Lọc theo số điện thoại nếu có
            if (!string.IsNullOrEmpty(phone))
            {
                query = query.Where(c => c.Phone == phone);
            }

            // Đếm tổng số bản ghi sau khi áp dụng bộ lọc
            var totalItems = await query.CountAsync();

            // Truy vấn dữ liệu phân trang, chỉ lấy các trường cần thiết từ Account
            var data = await query
                .Skip((pageIndex - 1) * pageSize)  // Phân trang: bỏ qua các bản ghi trước
                .Take(pageSize)                    // Lấy số lượng bản ghi cần thiết
                .Select(c => new TourGuide
                {
                    TourGuideId = c.TourGuideId,
                    FullName = c.FullName,
                    AccountId = c.AccountId,
                    Gender = c.Gender,
                    DateOfBirth = c.DateOfBirth,
                    Phone = c.Phone,
                    Address = c.Address,
                    Image = c.Image,
                    // Chỉ lấy các trường cần thiết từ Account
                    Account = new Account
                    {
                        AccountId = c.Account.AccountId,
                        Email = c.Account.Email,
                        Password = c.Account.Password,
                        CreatedDate = c.Account.CreatedDate,
                        Status = c.Account.Status
                    }
                })
                .ToListAsync();

            // Tạo kết quả phân trang và trả về
            return new PagedResult<TourGuide>
            {
                Result = data,
                TotalResult = totalItems,
                TotalPage = (int)Math.Ceiling((double)totalItems / pageSize)
            };
        }

        public async Task<TourGuide> GetByPhone(string phone)
        {
            return await _context.TourGuides.FirstOrDefaultAsync(x => x.Phone == phone);
        }
    }
}