using Microsoft.EntityFrameworkCore;
using Repositories.Context;
using Repositories.GenericRepository;
using Repositories.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Repositories.Repository
{
    public class MessagesRepository : GenericRepository<Message>
    {
        public MessagesRepository(TourmateContext context) : base(context)
        {
        }

        // Lấy danh sách tin nhắn của một cuộc trò chuyện
        public async Task<List<Message>> GetMessagesAsync(int conversationId, int page, int pageSize)
        {
            return await _context.Messages
                .Where(m => m.ConversationId == conversationId && !m.IsDeleted)
                .OrderByDescending(m => m.SendAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Include(m => m.Sender)  // Include sender info if needed
                .Include(m => m.MessageType) // Include message type info if needed
                .ToListAsync();
        }

        public async Task<bool> AnyMoreMessagesAsync(int conversationId, DateTime lastMessageTimestamp)
        {
            return await _context.Messages
                .Where(m => m.ConversationId == conversationId && m.SendAt < lastMessageTimestamp && !m.IsDeleted)
                .AnyAsync();
        }

        // Thêm một tin nhắn mới
        public async Task AddMessageAsync(int senderId, int conversationId, string messageText, int messageTypeId)
        {
            var message = new Message
            {
                SenderId = senderId,
                ConversationId = conversationId,
                MessageText = messageText,
                MessageTypeId = messageTypeId,
                SendAt = DateTime.UtcNow,
                IsRead = false,
                IsEdited = false,
                IsDeleted = false
            };

            await _context.AddAsync(message);
            await _context.SaveChangesAsync();
        }

        // Cập nhật trạng thái tin nhắn (ví dụ: đánh dấu đã đọc)
        public async Task MarkMessagesAsReadAsync(int conversationId, int userId)
        {
            var messages = await _context.Messages
                .Where(m => m.ConversationId == conversationId && m.SenderId == userId && !m.IsRead)
                .ToListAsync();

            if (!messages.Any()) return;

            foreach (var message in messages)
            {
                message.IsRead = true;
            }

            await _context.SaveChangesAsync();
        }

        // Xóa tin nhắn (soft delete)
        public async Task SoftDeleteMessageAsync(int messageId)
        {
            var message = await _context.Messages.FindAsync(messageId);
            if (message != null)
            {
                message.IsDeleted = true;
                _context.Messages.Update(message);
                await _context.SaveChangesAsync();
            }
        }
    }
}
