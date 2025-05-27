using Microsoft.EntityFrameworkCore;
using Repositories.DTO;
using Repositories.GenericRepository;
using Repositories.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

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
                    .Include(x => x.Account)
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
                .Include(x => x.TourGuideDescs)
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

        public async Task<PagedResult<TourGuide>> FilterByPhone(int pageSize, int pageIndex, string phone)
        {
            var query = _context.TourGuides.AsQueryable();

            // Lọc theo số điện thoại nếu có
            if (!string.IsNullOrEmpty(phone))
            {
                query = query.Where(c => c.Phone != null && c.Phone.Contains(phone));
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

        public new async Task<bool> UpdateProfile(TourGuide tourGuide)
        {
            try
            {
                var c = _context.TourGuides.Include(x => x.TourGuideDescs).FirstOrDefault(x => x.TourGuideId == tourGuide.TourGuideId);
                var d = c.TourGuideDescs.First();
                var newDesc = tourGuide.TourGuideDescs.First();
                newDesc.TourGuideDescId = d.TourGuideDescId;
                tourGuide.TourGuideDescs = [newDesc];
                _context.Entry(c).CurrentValues.SetValues(tourGuide);
                _context.Entry(d).CurrentValues.SetValues(newDesc);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<PagedResult<TourGuide>> GetList(int pageSize, int pageIndex, string? name, int? areaId)
        {
            name = name != null ? name.ToLower() : "";
            var query = _context.TourGuides
                .Include(x => x.TourGuideDescs)
                .Where(x =>
                (string.IsNullOrEmpty(name) || x.FullName.ToLower().Contains(name))
                && (areaId == null || x.TourGuideDescs.First().AreaId == areaId));
            var result = query.Skip((pageIndex - 1) * pageSize).Take(pageSize);
            var totalResult = await result.CountAsync();
            return new PagedResult<TourGuide>
            {
                Result = result.ToList(),
                TotalResult = totalResult,
                TotalPage = (int)Math.Ceiling((double)totalResult / pageSize)
            };
        }

        public async Task<bool> ChangePicture(int id, string fieldToChange, string newValue)
        {
            try
            {
                var c = _context.TourGuides.Include(x => x.TourGuideDescs).FirstOrDefault(x => x.TourGuideId == id);
                switch (fieldToChange)
                {
                    case "Image":
                        c.Image = newValue;
                        break;
                    case "BannerImage":
                        c.BannerImage = newValue;
                        break;
                    default:
                        return false; // Trường không hợp lệ
                }
                ;
                _context.Entry(c).CurrentValues.SetValues(c);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<bool> ChangePassword(int id, string password)
        {
            try
            {
                var c = _context.TourGuides.Include(x => x.TourGuideDescs).FirstOrDefault(x => x.TourGuideId == id);
                
                _context.Entry(c).CurrentValues.SetValues(c);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}