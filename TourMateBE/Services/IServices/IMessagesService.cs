using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface IMessagesService
    {
        Message GetMessages(int id);
        IEnumerable<Message> GetAll(int pageSize, int pageIndex);
        Task<Message> CreateMessages(Message messages);
        Task<Message> CreateMessageWithFile(Message messages);
        Task MarkConversationAsRead(int conversationId, int userId);
        bool DeleteMessages(int id);
        Task<(List<Message> messages, bool hasMore)> GetMessagesAsync(int conversationId, int page, int pageSize);
    }
}
