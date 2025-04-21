using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class BlogLikeCreateModel
    {
        public int AccountId { get; set; }

        public int BlogId { get; set; }
        public BlogLike Convert() => new()
        {
            AccountId = AccountId,
            BlogId = BlogId,
            BlogLikeId = 0,
        };
    }
}