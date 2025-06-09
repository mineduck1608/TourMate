using Repositories.Models;
using Repositories.GenericRepository;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using Microsoft.IdentityModel.Tokens;
using Repositories.DTO.ResultModels;

namespace Repositories.Repository
{
    public class NewsRepository : GenericRepository<News>
    {
        public async Task<PagedResult<News>> FilterByCategory(int pageSize, int pageIndex, string category)
        {
            var query = _context.News.AsQueryable();
            query = query.Where(e => category.IsNullOrEmpty() || e.Category == category).OrderByDescending(e => e.CreatedAt);

            // Phân trang
            var result = await query
                .Skip(pageSize * (pageIndex - 1))
                .Take(pageSize)
                .ToListAsync();

            // Lấy tổng số bản ghi
            var totalAmount = await query.CountAsync();

            return new PagedResult<News>
            {
                Result = result,
                TotalResult = totalAmount,
                TotalPage = totalAmount / pageSize + (totalAmount % pageSize != 0 ? 1 : 0)
            };
        }

        public async Task<List<News>> GetRecentNews(int excludeId, int count)
        {
            return await _context.News
                .Where(x => x.NewsId != excludeId)
                .OrderByDescending(x => x.CreatedAt)
                .Take(count)
                .ToListAsync();
        }
    }
}