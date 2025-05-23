using Microsoft.EntityFrameworkCore;
using Repositories.GenericRepository;
using Repositories.Models;

namespace Repositories.Repository
{
    public class ConversationRepository : GenericRepository<Conversation>
    {
        public async Task<Conversation?> GetConversationAsync(int conversationId)
        {
            return await _context.Conversations
                .Include(c => c.Account1)
                .Include(c => c.Account2)
                .Include(c => c.Messages)
                .FirstOrDefaultAsync(c => c.ConversationId == conversationId);
        }

        public async Task<Conversation?> GetConversationByAccountsAsync(int account1Id, int account2Id)
        {
            return await _context.Conversations
                .Include(c => c.Account1)
                .Include(c => c.Account2)
                .Include(c => c.Messages)
                .FirstOrDefaultAsync(c =>
                    (c.Account1Id == account1Id && c.Account2Id == account2Id) ||
                    (c.Account1Id == account2Id && c.Account2Id == account1Id)
                );
        }

        public async Task<List<Message>> GetMessagesByConversationAsync(int conversationId, int page, int pageSize)
        {
            return await _context.Messages
                .Where(m => m.ConversationId == conversationId && !m.IsDeleted)
                .OrderByDescending(m => m.SendAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Include(m => m.Sender)
                .Include(m => m.MessageType)
                .ToListAsync();
        }

        // Check if there are more messages for pagination
        public async Task<bool> AnyMoreMessagesAsync(int conversationId, DateTime lastMessageTimestamp)
        {
            return await _context.Messages
                .Where(m => m.ConversationId == conversationId && m.SendAt < lastMessageTimestamp && !m.IsDeleted)
                .AnyAsync();
        }
    }
}