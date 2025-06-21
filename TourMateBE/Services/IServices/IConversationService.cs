using Repositories.Models;
using Repositories.ResponseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
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
        Task<Conversation> GetOrCreateConversationAsync(int currentUserId, int userId);
    }
}
