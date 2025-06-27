using Repositories.Models;
using Repositories.IRepositories;
using Repositories.ResponseModels;
using Services.IServices;

namespace Services.Services
{
    public class ConversationService : IConversationService
    {
        private readonly IConversationRepository ConversationRepository;
        private readonly IAccountRepository _accountRepo;

        public ConversationService(IConversationRepository conversationRepo, IAccountRepository accountRepo)
        {
            ConversationRepository = conversationRepo;
            _accountRepo = accountRepo;
        }

        public async Task<Conversation> GetOrCreateConversationAsync(int currentUserId, int userId)
        {
            var conversation = await ConversationRepository.GetConversationBetweenUsersAsync(currentUserId, userId);
            if (conversation != null) return conversation;

            var newConv = new Conversation
            {
                Account1Id = currentUserId,
                Account2Id = userId,
                CreatedAt = DateTime.Now
            };

            return await ConversationRepository.CreateConversationAsync(newConv);
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