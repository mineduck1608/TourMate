using Microsoft.AspNetCore.Mvc;
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
                var account = await _accountService.GetAccount(message.SenderId);

                if (account != null)
                {
                    if (account.RoleId == 2)
                    {
                        var customer = await _customerService.GetCustomerByAccId(message.SenderId);
                        if (customer != null)
                            senderName = customer.FullName;
                    }
                    else if (account.RoleId == 3)
                    {
                        var tourGuide = await _tourGuideService.GetTourGuideByAccId(message.SenderId);
                        if (tourGuide != null)
                            senderName = tourGuide.FullName;
                    }
                }

                messagesWithSenderName.Add(new
                {
                    message.MessageId,
                    message.ConversationId,
                    message.MessageText,
                    message.SendAt,
                    message.SenderId,
                    senderName
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