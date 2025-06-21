using Repositories.GenericRepository;
using Repositories.Models;
using Repositories.ResponseModels;

namespace Repositories.IRepositories
{
    public interface IConversationRepository : IGenericRepository<Conversation>
    {
        Task<Conversation?> GetConversationBetweenUsersAsync(int userId1, int userId2);
        Task<Conversation> CreateConversationAsync(Conversation conversation);
        Task<Conversation?> GetConversationAsync(int conversationId);
        Task<Conversation?> GetConversationByAccountsAsync(int account1Id, int account2Id);
        Task<(List<ConversationResponse> Conversations, int TotalCount)> GetConversationsByUserIdAsync(int userId, string searchTerm, int page, int pageSize);
        Task<List<Message>> GetMessagesByConversationAsync(int conversationId, int page, int pageSize);
        Task<bool> AnyMoreMessagesAsync(int conversationId, DateTime lastMessageTimestamp);
    }
}
