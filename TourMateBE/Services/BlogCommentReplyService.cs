using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface IBlogCommentReplyService
    {
        BlogCommentReply GetBlogCommentReply(int id);
        IEnumerable<BlogCommentReply> GetAll(int pageSize, int pageIndex);
        void CreateBlogCommentReply(BlogCommentReply blogcommentreply);
        void UpdateBlogCommentReply(BlogCommentReply blogcommentreply);
        bool DeleteBlogCommentReply(int id);
    }

    public class BlogCommentReplyService : IBlogCommentReplyService
    {
        private BlogCommentReplyRepository BlogCommentReplyRepository { get; set; } = new();

        public BlogCommentReply GetBlogCommentReply(int id)
        {
            return BlogCommentReplyRepository.GetById(id);
        }

        public IEnumerable<BlogCommentReply> GetAll(int pageSize, int pageIndex)
        {
            return BlogCommentReplyRepository.GetAll(pageSize, pageIndex);
        }

        public void CreateBlogCommentReply(BlogCommentReply blogcommentreply)
        {
            BlogCommentReplyRepository.Create(blogcommentreply);
        }

        public void UpdateBlogCommentReply(BlogCommentReply blogcommentreply)
        {
            BlogCommentReplyRepository.Update(blogcommentreply);
        }

        public bool DeleteBlogCommentReply(int id)
        {
            BlogCommentReplyRepository.Remove(id);
            return true;
        }
    }
}