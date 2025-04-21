using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class BlogCommentCreateModel
    {
        public int AccountId { get; set; }

        public int BlogId { get; set; }

        public string Content { get; set; }

        public DateTime CreatedAt { get; set; }

        public bool IsDeleted { get; set; }

        public DateTime? UpdatedAt { get; set; }
        public BlogComment Convert() => new()
        {
            CreatedAt = CreatedAt,
            AccountId = AccountId,
            BlogId = BlogId,
            Content = Content,
            IsDeleted = IsDeleted,
            UpdatedAt = UpdatedAt,
            BlogCommentId = 0,
        };
    }
}