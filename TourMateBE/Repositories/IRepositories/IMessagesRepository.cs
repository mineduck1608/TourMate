using Repositories.GenericRepository;
using Repositories.Models;

namespace Repositories.IRepositories
{
    public interface IMessagesRepository : IGenericRepository<Message>
    {
        Task<List<Message>> GetMessagesAsync(int conversationId, int page, int pageSize);
        Task<bool> AnyMoreMessagesAsync(int conversationId, DateTime lastMessageTimestamp);
        Task AddMessageAsync(int senderId, int conversationId, string messageText, int messageTypeId);
        Task MarkMessagesAsReadAsync(int conversationId, int userId);
        Task SoftDeleteMessageAsync(int messageId);
        Task<Message?> CreateMessageWithFile(Message messages);
    }
}
