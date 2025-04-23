using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class BlogCommentReplyCreateModel
    {
        public int AccountId { get; set; }

        public int BlogCommentId { get; set; }

        public string Content { get; set; }

        public DateTime CreatedAt { get; set; }

        public bool IsDeleted { get; set; }

        public DateTime? UpdatedAt { get; set; }
        public BlogCommentReply Convert() => new()
        {
            CreatedAt = CreatedAt,
            AccountId = AccountId,
            Content = Content,
            IsDeleted = IsDeleted,
            UpdatedAt = UpdatedAt,
            BlogCommentId = BlogCommentId,
            BlogCommentReplyId = 0,
        };
    }
}