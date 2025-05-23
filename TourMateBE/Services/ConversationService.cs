using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface IConversationService
    {
        Conversation GetConversation(int id);
        IEnumerable<Conversation> GetAll(int pageSize, int pageIndex);
        void CreateConversation(Conversation conversation);
        void UpdateConversation(Conversation conversation);
        bool DeleteConversation(int id);
        Task<Conversation?> GetConversationAsync(int conversationId);
        Task<Conversation?> GetConversationByAccountsAsync(int account1Id, int account2Id);
        Task<(List<Message> messages, bool hasMore)> GetMessagesAsync(int conversationId, int page, int pageSize);
    }

    public class ConversationService : IConversationService
    {
        private ConversationRepository ConversationRepository { get; set; } = new();

        public async Task<Conversation?> GetConversationAsync(int conversationId)
        {
            return await ConversationRepository.GetConversationAsync(conversationId);
        }

        public async Task<Conversation?> GetConversationByAccountsAsync(int account1Id, int account2Id)
        {
            return await ConversationRepository.GetConversationByAccountsAsync(account1Id, account2Id);
        }

        public async Task<(List<Message> messages, bool hasMore)> GetMessagesAsync(int conversationId, int page, int pageSize)
        {
            var messages = await ConversationRepository.GetMessagesByConversationAsync(conversationId, page, pageSize);
            var hasMore = messages.Count == pageSize &&
                          await ConversationRepository.AnyMoreMessagesAsync(conversationId, messages.LastOrDefault()?.SendAt ?? DateTime.MinValue);

            return (messages, hasMore);
        }

        public Conversation GetConversation(int id)
        {
            return ConversationRepository.GetById(id);
        }

        public IEnumerable<Conversation> GetAll(int pageSize, int pageIndex)
        {
            return ConversationRepository.GetAll(pageSize, pageIndex);
        }

        public void CreateConversation(Conversation conversation)
        {
            ConversationRepository.Create(conversation);
        }

        public void UpdateConversation(Conversation conversation)
        {
            ConversationRepository.Update(conversation);
        }

        public bool DeleteConversation(int id)
        {
            ConversationRepository.Remove(id);
            return true;
        }
    }
}