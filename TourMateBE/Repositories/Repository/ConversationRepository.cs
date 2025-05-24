using Microsoft.EntityFrameworkCore;
using Repositories.DTO;
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

        public async Task<(List<ConversationResponse> Conversations, int TotalCount)> GetConversationsByUserIdAsync(
    int userId,
    string searchTerm,
    int page,
    int pageSize)
        {
            searchTerm = searchTerm?.Trim().ToLower() ?? "";

            var query = _context.Conversations
                .Where(c => c.Account1Id == userId || c.Account2Id == userId);

            var conversationWithDetails = from c in query
                                          join a1 in _context.Accounts on c.Account1Id equals a1.AccountId
                                          join cust1 in _context.Customers on a1.AccountId equals cust1.AccountId into custGroup1
                                          from cust1 in custGroup1.DefaultIfEmpty()
                                          join guide1 in _context.TourGuides on a1.AccountId equals guide1.AccountId into guideGroup1
                                          from guide1 in guideGroup1.DefaultIfEmpty()

                                          join a2 in _context.Accounts on c.Account2Id equals a2.AccountId
                                          join cust2 in _context.Customers on a2.AccountId equals cust2.AccountId into custGroup2
                                          from cust2 in custGroup2.DefaultIfEmpty()
                                          join guide2 in _context.TourGuides on a2.AccountId equals guide2.AccountId into guideGroup2
                                          from guide2 in guideGroup2.DefaultIfEmpty()

                                          let name1 = a1.RoleId == 2 ? cust1.FullName :
                                                      (a1.RoleId == 3 ? guide1.FullName : "")
                                          let name2 = a2.RoleId == 2 ? cust2.FullName :
                                                      (a2.RoleId == 3 ? guide2.FullName : "")
                                          where string.IsNullOrEmpty(searchTerm) ||
       ((c.Account1Id == userId && name2.ToLower().Contains(searchTerm)) ||
        (c.Account2Id == userId && name1.ToLower().Contains(searchTerm)))


                                          select new
                                          {
                                              Conversation = c,
                                              AccountName1 = name1,
                                              AccountName2 = name2
                                          };

            int totalCount = await conversationWithDetails.CountAsync();

            // Lấy danh sách conversation theo phân trang
            var pagedConversations = await conversationWithDetails
                .OrderByDescending(x => x.Conversation.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Lấy message mới nhất cho từng conversation (có thể tối ưu query sau nếu cần)
            var conversationIds = pagedConversations.Select(c => c.Conversation.ConversationId).ToList();

            var latestMessages = await _context.Messages
                .Where(m => conversationIds.Contains(m.ConversationId))
                .GroupBy(m => m.ConversationId)
                .Select(g => g.OrderByDescending(m => m.SendAt).FirstOrDefault())
                .ToListAsync();

            // Ghép kết quả vào DTO ConversationResponse
            var result = pagedConversations.Select(c =>
            {
                var latestMessage = latestMessages.FirstOrDefault(m => m.ConversationId == c.Conversation.ConversationId);

                bool isRead;
                if (latestMessage == null)
                {
                    isRead = true; // Không có tin nhắn => coi là đã đọc
                }
                else if (latestMessage.SenderId == userId)
                {
                    isRead = true; // Tin nhắn do chính user gửi => luôn là đã đọc
                }
                else
                {
                    isRead = latestMessage.IsRead; // Lấy trạng thái từ database
                }

                return new ConversationResponse
                {
                    Conversation = c.Conversation,
                    AccountName1 = c.AccountName1,
                    AccountName2 = c.AccountName2,
                    LatestMessage = latestMessage,
                    IsRead = isRead
                };
            }).ToList();


            return (result, totalCount);
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