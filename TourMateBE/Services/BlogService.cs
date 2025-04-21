using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface IBlogService
    {
        Blog GetBlog(int id);
        IEnumerable<Blog> GetAll(int pageSize, int pageIndex);
        void CreateBlog(Blog blog);
        void UpdateBlog(Blog blog);
        bool DeleteBlog(int id);
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

        public void CreateBlog(Blog blog)
        {
            BlogRepository.Create(blog);
        }

        public void UpdateBlog(Blog blog)
        {
            BlogRepository.Update(blog);
        }

        public bool DeleteBlog(int id)
        {
            BlogRepository.Remove(id);
            return true;
        }
    }
}