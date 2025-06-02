using Microsoft.AspNetCore.Mvc;
using Repositories.DTO;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/conversation")]
    [ApiController]
    public class ConversationController : ControllerBase
    {
        private readonly IConversationService _conversationService;
        private readonly IAccountService _accountService;
        private readonly ICustomerService _customerService;
        private readonly ITourGuideService _tourGuideService;

        public ConversationController(IConversationService conversationService, IAccountService accountService, ICustomerService customerService, ITourGuideService tourGuideService)
        {
            _conversationService = conversationService;
            _accountService = accountService;
            _customerService = customerService;
            _tourGuideService = tourGuideService;
        }

        [HttpGet("fetch-or-create")]
        public async Task<IActionResult> FetchOrCreateConversation([FromQuery] int currentUserId, [FromQuery] int userId)
        {
            // 1. Lấy hoặc tạo conversation giữa 2 user
            var conversation = await _conversationService.GetOrCreateConversationAsync(currentUserId, userId);

            // 2. Lấy info cho account1 (currentUserId)
            string accountName1 = "Người dùng";
            string account1Img = "";
            var account1 = await _accountService.GetAccount(currentUserId);
            if (account1 != null)
            {
                if (account1.RoleId == 2) // Customer
                {
                    var customer = await _customerService.GetCustomerByAccId(currentUserId);
                    if (customer != null)
                    {
                        accountName1 = customer.FullName;
                        account1Img = customer.Image;
                    }
                }
                else if (account1.RoleId == 3) // TourGuide
                {
                    var tourGuide = await _tourGuideService.GetTourGuideByAccId(currentUserId);
                    if (tourGuide != null)
                    {
                        accountName1 = tourGuide.FullName;
                        account1Img = tourGuide.Image;
                    }
                }
                else
                {
                    accountName1 = "Người dùng";
                }
            }

            // 3. Lấy info cho account2 (userId)
            string accountName2 = "Người dùng";
            string account2Img = "";
            var account2 = await _accountService.GetAccount(userId);
            if (account2 != null)
            {
                if (account2.RoleId == 2) // Customer
                {
                    var customer = await _customerService.GetCustomerByAccId(userId);
                    if (customer != null)
                    {
                        accountName2 = customer.FullName;
                        account2Img = customer.Image;
                    }
                }
                else if (account2.RoleId == 3) // TourGuide
                {
                    var tourGuide = await _tourGuideService.GetTourGuideByAccId(userId);
                    if (tourGuide != null)
                    {
                        accountName2 = tourGuide.FullName;
                        account2Img = tourGuide.Image;
                    }
                }
                else
                {
                    accountName2 = "Người dùng";
                }
            }

            // 6. Trả về dữ liệu dạng đúng kiểu ConversationResponse
            var response = new ConversationResponse
            {
                Conversation = conversation,
                AccountName1 = accountName1,
                AccountName2 = accountName2,
                LatestMessage = null,
                IsRead = false,
                Account2Img = null
            };

            return Ok(response);
        }



        [HttpGet]
        public async Task<IActionResult> GetConversations(
       [FromQuery] int userId,
       [FromQuery] string? searchTerm,
       [FromQuery] int page = 1,
       [FromQuery] int pageSize = 20)
        {
            if (userId <= 0)
                return BadRequest("Invalid userId");
            if (page <= 0 || pageSize <= 0)
                return BadRequest("Page and pageSize must be positive");

            var result = await _conversationService.GetConversationsAsync(userId, searchTerm ?? "", page, pageSize);

            return Ok(new
            {
                conversations = result.Conversations,
                totalCount = result.TotalCount,
                hasMore = result.HasMore
            });
        }

        // Lấy tin nhắn theo ConversationId với phân trang
        [HttpGet("{conversationId}/messages")]
        public async Task<IActionResult> GetMessages(int conversationId, [FromQuery] int page = 1, [FromQuery] int pageSize = 2)
        {
            var (messages, hasMore) = await _conversationService.GetMessagesAsync(conversationId, page, pageSize);

            // Giúp map senderId trong từng message thành senderName
            var messagesWithSenderName = new List<object>();

            foreach (var message in messages)
            {
                string senderName = "Người dùng";
                string senderAvatarUrl = "";
                var account = await _accountService.GetAccount(message.SenderId);

                if (account != null)
                {
                    if (account.RoleId == 2)
                    {
                        var customer = await _customerService.GetCustomerByAccId(message.SenderId);
                        if (customer != null)
                            senderName = customer.FullName;
                        senderAvatarUrl = customer.Image;
                    }
                    else if (account.RoleId == 3)
                    {
                        var tourGuide = await _tourGuideService.GetTourGuideByAccId(message.SenderId);
                        if (tourGuide != null)
                            senderName = tourGuide.FullName;
                        senderAvatarUrl = tourGuide.Image;

                    }
                }

                messagesWithSenderName.Add(new
                {
                    message.MessageId,
                    message.ConversationId,
                    message.MessageText,
                    message.SendAt,
                    message.SenderId,
                    senderName,
                    senderAvatarUrl
                });
            }

            return Ok(new
            {
                messages = messagesWithSenderName,
                hasMore
            });
        }
    }
}