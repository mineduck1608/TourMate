using Repositories.DTO;
using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface IBlogService
    {
        Blog GetBlog(int id);
        IEnumerable<Blog> GetAll(int pageSize, int pageIndex);
        Task CreateBlog(Blog blog);
        Task UpdateBlog(Blog blog);
        Task<bool> DeleteBlog(int id);
        Task<PagedResult<Blog>> GetBlogsOfAccount(int id, int pageSize, int pageIndex);
    }

    public class BlogService : IBlogService
    {
        private BlogRepository BlogRepository { get; set; } = new();

        public Blog GetBlog(int id)
        {
            return BlogRepository.GetById(id);
        }

        public IEnumerable<Blog> GetAll(int pageSize, int pageIndex)
        {
            return BlogRepository.GetAll(pageSize, pageIndex);
        }

        public async Task CreateBlog(Blog blog)
        {
            await BlogRepository.CreateAsync(blog);
        }

        public async Task UpdateBlog(Blog blog)
        {
            await BlogRepository.UpdateAsync(blog);
        }

        public async Task<bool> DeleteBlog(int id)
        {
            await BlogRepository.RemoveAsync(id);
            return true;
        }
        public async Task<PagedResult<Blog>> GetBlogsOfAccount(int id, int pageSize, int pageIndex)
        {
            return await BlogRepository.GetBlogsOfAccount(id, pageSize, pageIndex);
        }
    }
}