using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface IBlogLikeService
    {
        BlogLike GetBlogLike(int id);
        IEnumerable<BlogLike> GetAll(int pageSize, int pageIndex);
        void CreateBlogLike(BlogLike bloglike);
        void UpdateBlogLike(BlogLike bloglike);
        bool DeleteBlogLike(int id);
    }

    public class BlogLikeService : IBlogLikeService
    {
        private BlogLikeRepository BlogLikeRepository { get; set; } = new();

        public BlogLike GetBlogLike(int id)
        {
            return BlogLikeRepository.GetById(id);
        }

        public IEnumerable<BlogLike> GetAll(int pageSize, int pageIndex)
        {
            return BlogLikeRepository.GetAll(pageSize, pageIndex);
        }

        public void CreateBlogLike(BlogLike bloglike)
        {
            BlogLikeRepository.Create(bloglike);
        }

        public void UpdateBlogLike(BlogLike bloglike)
        {
            BlogLikeRepository.Update(bloglike);
        }

        public bool DeleteBlogLike(int id)
        {
            BlogLikeRepository.Remove(id);
            return true;
        }
    }
}