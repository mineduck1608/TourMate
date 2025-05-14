using Repositories.Models;
using Repositories.GenericRepository;
using Repositories.DTO;
using Microsoft.EntityFrameworkCore;

namespace Repositories.Repository
{
    public class BlogRepository : GenericRepository<Blog>
    {
        public async Task<PagedResult<Blog>> GetBlogsOfAccount(int id, int pageSize, int pageIndex)
        {
            var blogs = _context.Blogs
                .Where(b => b.AccountId == id);
            var count = blogs.Count();
            var result = blogs
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .ToList();
            return new()
            {
                Result = result,
                TotalResult = count,
                TotalPage = count / pageSize + (count % pageSize != 0 ? 1 : 0)
            };
        }
    }
}