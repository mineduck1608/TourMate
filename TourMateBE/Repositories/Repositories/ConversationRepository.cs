using Microsoft.EntityFrameworkCore;
using Repositories.DTO.ResultModels;
using Repositories.GenericRepository;
using Repositories.Models;

namespace Repositories.Repository
{
    public class ConversationRepository : GenericRepository<Conversation>
    {
        public async Task<Conversation?> GetConversationBetweenUsersAsync(int userId1, int userId2)
        {
            return await _context.Conversations.Include(c => c.Account1)
                .Include(c => c.Account2)
                .FirstOrDefaultAsync(c =>
                    (c.Account1Id == userId1 && c.Account2Id == userId2) ||
                    (c.Account1Id == userId2 && c.Account2Id == userId1));
        }

        public async Task<Conversation> CreateConversationAsync(Conversation conversation)
        {
            _context.Conversations.Add(conversation);
            await _context.SaveChangesAsync();
            return conversation;
        }

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

            // Lấy latest SendAt cho từng conversation
            var latestSendAts = _context.Messages
                .GroupBy(m => m.ConversationId)
                .Select(g => new
                {
                    ConversationId = g.Key,
                    LatestSendAt = g.Max(m => m.SendAt)
                });

            // Lấy danh sách hội thoại liên quan và chuẩn hóa Account1 = userId, Account2 = đối phương
            var baseQuery = _context.Conversations
                .Where(c => c.Account1Id == userId || c.Account2Id == userId)
                .Select(c => new
                {
                    Conversation = c,
                    // Nếu userId đang ở Account2 thì đổi chỗ cho Account1 là userId
                    Account1Id = userId,
                    Account2Id = c.Account1Id == userId ? c.Account2Id : c.Account1Id
                });

            // Join với Account1, Customer1, Guide1 dựa vào Account1Id = userId
            var conversationWithDetails = from q in baseQuery

                                          join a1 in _context.Accounts on q.Account1Id equals a1.AccountId
                                          join cust1 in _context.Customers on a1.AccountId equals cust1.AccountId into custGroup1
                                          from cust1 in custGroup1.DefaultIfEmpty()
                                          join guide1 in _context.TourGuides on a1.AccountId equals guide1.AccountId into guideGroup1
                                          from guide1 in guideGroup1.DefaultIfEmpty()

                                          join a2 in _context.Accounts on q.Account2Id equals a2.AccountId
                                          join cust2 in _context.Customers on a2.AccountId equals cust2.AccountId into custGroup2
                                          from cust2 in custGroup2.DefaultIfEmpty()
                                          join guide2 in _context.TourGuides on a2.AccountId equals guide2.AccountId into guideGroup2
                                          from guide2 in guideGroup2.DefaultIfEmpty()

                                          join latest in latestSendAts on q.Conversation.ConversationId equals latest.ConversationId into latestGroup
                                          from latest in latestGroup.DefaultIfEmpty()

                                          let name1 = a1.RoleId == 2 ? cust1.FullName :
                                                      (a1.RoleId == 3 ? guide1.FullName : "")
                                          let name2 = a2.RoleId == 2 ? cust2.FullName :
                                                      (a2.RoleId == 3 ? guide2.FullName : "")
                                          let img2 = a2.RoleId == 2 ? cust2.Image :
                                                      (a2.RoleId == 3 ? guide2.Image : "")

                                          where string.IsNullOrEmpty(searchTerm) ||
                                                name2.ToLower().Contains(searchTerm)

                                          select new
                                          {
                                              Conversation = new Conversation
                                              {
                                                  ConversationId = q.Conversation.ConversationId,
                                                  // Nếu userId là Account1Id trong DB thì giữ nguyên, nếu là Account2Id thì tráo vị trí
                                                  Account1Id = userId,
                                                  Account2Id = (q.Conversation.Account1Id == userId) ? q.Conversation.Account2Id : q.Conversation.Account1Id,
                                                  CreatedAt = q.Conversation.CreatedAt,
                                              },
                                              AccountName1 = name1,
                                              AccountName2 = name2,
                                              LatestSendAt = latest != null ? latest.LatestSendAt : (DateTime?)null,
                                              Account2Img = img2 ?? ""
                                          };

            // Sắp xếp theo thời gian gửi tin nhắn mới nhất (hoặc CreatedAt nếu chưa có)
            var orderedConversations = conversationWithDetails
                .OrderByDescending(c => c.LatestSendAt ?? c.Conversation.CreatedAt);

            int totalCount = await orderedConversations.CountAsync();

            var pagedConversations = await orderedConversations
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var conversationIds = pagedConversations.Select(c => c.Conversation.ConversationId).ToList();

            var latestMessages = await _context.Messages
                .Where(m => conversationIds.Contains(m.ConversationId))
                .GroupBy(m => m.ConversationId)
                .Select(g => g.OrderByDescending(m => m.SendAt).FirstOrDefault())
                .ToListAsync();

            var result = pagedConversations.Select(c =>
            {
                var latestMessage = latestMessages.FirstOrDefault(m => m.ConversationId == c.Conversation.ConversationId);

                bool isRead;
                if (latestMessage == null)
                {
                    isRead = true;
                }
                else if (latestMessage.SenderId == userId)
                {
                    isRead = true;
                }
                else
                {
                    isRead = latestMessage.IsRead;
                }

                return new ConversationResponse
                {
                    Conversation = c.Conversation,
                    AccountName1 = c.AccountName1,
                    AccountName2 = c.AccountName2,
                    LatestMessage = latestMessage,
                    IsRead = isRead,
                    Account2Img = c.Account2Img
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