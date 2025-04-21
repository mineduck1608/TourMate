using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class ConversationCreateModel
    {

        public int Account1Id { get; set; }

        public int Account2Id { get; set; }

        public DateTime CreatedAt { get; set; }
        public Conversation Convert() => new()
        {
            Account1Id = Account1Id,
            Account2Id = Account2Id,
            CreatedAt = CreatedAt,
            ConersationId = 0,
        };
    }
}