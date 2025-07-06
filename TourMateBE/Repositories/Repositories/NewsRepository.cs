using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Repositories.Context;
using Repositories.GenericRepository;
using Repositories.IRepositories;
using Repositories.Models;
using Repositories.ResponseModels;
using System.Globalization;

namespace Repositories.Repositories
{
    public class NewsRepository : GenericRepository<News>, INewsRepository
    {
        public NewsRepository(TourmateContext context) : base(context) { }

        public async Task<PagedResult<News>> FilterByCategory(int pageSize, int pageIndex, string category, bool excludeContent)
        {
            var query = _context.News.AsQueryable();
            query = query.Where(e => category.IsNullOrEmpty() || e.Category == category).OrderByDescending(e => e.CreatedAt);

            // Phân trang
            var result = await query
                .Select(e => new News
                {
                    NewsId = e.NewsId,
                    Title = e.Title,
                    Category = e.Category,
                    CreatedAt = e.CreatedAt,
                    Content = excludeContent ? "" : e.Content, // Nếu excludeContent là true, không lấy nội dung
                    BannerImg = e.BannerImg
                })
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