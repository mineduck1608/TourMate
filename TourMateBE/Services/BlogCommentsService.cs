using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface IBlogCommentService
    {
        BlogComment GetBlogComment(int id);
        IEnumerable<BlogComment> GetAll(int pageSize, int pageIndex);
        void CreateBlogComment(BlogComment BlogComment);
        void UpdateBlogComment(BlogComment BlogComment);
        bool DeleteBlogComment(int id);
    }

    public class BlogCommentService : IBlogCommentService
    {
        private BlogCommentRepository BlogCommentRepository { get; set; } = new();

        public BlogComment GetBlogComment(int id)
        {
            return BlogCommentRepository.GetById(id);
        }

        public IEnumerable<BlogComment> GetAll(int pageSize, int pageIndex)
        {
            return BlogCommentRepository.GetAll(pageSize, pageIndex);
        }

        public void CreateBlogComment(BlogComment BlogComment)
        {
            BlogCommentRepository.Create(BlogComment);
        }

        public void UpdateBlogComment(BlogComment BlogComment)
        {
            BlogCommentRepository.Update(BlogComment);
        }

        public bool DeleteBlogComment(int id)
        {
            BlogCommentRepository.Remove(id);
            return true;
        }
    }
}