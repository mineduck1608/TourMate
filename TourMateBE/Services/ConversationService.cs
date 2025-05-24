using Repositories.Models;
using Repositories.DTO;
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
        Task<ConversationListResult> GetConversationsAsync(int userId, string searchTerm, int page, int pageSize);
        Task<(List<Message> messages, bool hasMore)> GetMessagesAsync(int conversationId, int page, int pageSize);
    }

    public class ConversationService : IConversationService
    {
        private readonly ConversationRepository ConversationRepository;
        private readonly AccountRepository _accountRepo;

        public ConversationService(ConversationRepository conversationRepo, AccountRepository accountRepo)
        {
            ConversationRepository = conversationRepo;
            _accountRepo = accountRepo;
        }


        public async Task<ConversationListResult> GetConversationsAsync(int userId, string searchTerm, int page, int pageSize)
        {
            var (conversations, totalCount) = await ConversationRepository.GetConversationsByUserIdAsync(userId, searchTerm, page, pageSize);

            return new ConversationListResult
            {
                Conversations = conversations,
                TotalCount = totalCount,
                HasMore = totalCount > page * pageSize
            };
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