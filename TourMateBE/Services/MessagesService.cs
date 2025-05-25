using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface IMessagesService
    {
        Message GetMessages(int id);
        IEnumerable<Message> GetAll(int pageSize, int pageIndex);
        Task<Message> CreateMessages(Message messages);
        Task MarkConversationAsRead(int conversationId, int userId);
        bool DeleteMessages(int id);
        Task<(List<Message> messages, bool hasMore)> GetMessagesAsync(int conversationId, int page, int pageSize);
    }

    public class MessagesService : IMessagesService
    {
        private MessagesRepository MessagesRepository;

        public MessagesService(MessagesRepository messagesRepository)
        {
            MessagesRepository = messagesRepository;
        }

        public Message GetMessages(int id)
        {
            return MessagesRepository.GetById(id);
        }

        public async Task<(List<Message> messages, bool hasMore)> GetMessagesAsync(int conversationId, int page, int pageSize)
        {
            var messages = await MessagesRepository.GetMessagesAsync(conversationId, page, pageSize);
            var hasMore = messages.Count == pageSize &&
                          await MessagesRepository.AnyMoreMessagesAsync(conversationId, messages.LastOrDefault()?.SendAt ?? DateTime.MinValue);

            return (messages, hasMore);
        }

        public IEnumerable<Message> GetAll(int pageSize, int pageIndex)
        {
            return MessagesRepository.GetAll(pageSize, pageIndex);
        }

        public async Task<Message> CreateMessages(Message messages)
        {
            return await MessagesRepository.CreateAndReturnAsync(messages);
        }

        public async Task MarkConversationAsRead(int conversationId, int userId)
        {
            await MessagesRepository.MarkMessagesAsReadAsync(conversationId, userId);
        }

        public bool DeleteMessages(int id)
        {
            MessagesRepository.Remove(id);
            return true;
        }
    }
}