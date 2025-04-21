using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class BlogCreateModel
    {
        public DateTime CreatedDate { get; set; }

        public bool IsDeleted { get; set; }

        public string Content { get; set; }

        public string Media { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public int AccountId { get; set; }
        public Blog Convert() => new()
        {
            CreatedDate = CreatedDate,
            IsDeleted = IsDeleted,
            Content = Content,
            Media = Media,
            UpdatedAt = UpdatedAt,
            AccountId = AccountId,
            BlogId = 0,
        };
    }
}