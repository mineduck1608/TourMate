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

        // Lấy thông tin cuộc trò chuyện
        [HttpGet("{conversationId}")]
        public async Task<IActionResult> GetConversation(int conversationId)
        {
            var conversation = await _conversationService.GetConversationAsync(conversationId);
            if (conversation == null)
            {
                return NotFound("Conversation not found.");
            }

            return Ok(conversation);
        }

        // Lấy thông tin cuộc trò chuyện giữa hai tài khoản
        [HttpGet("between/{account1Id}/{account2Id}")]
        public async Task<IActionResult> GetConversationByAccounts(int account1Id, int account2Id)
        {
            var conversation = await _conversationService.GetConversationByAccountsAsync(account1Id, account2Id);
            if (conversation == null)
            {
                return NotFound("Conversation not found.");
            }

            return Ok(conversation);
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


        [HttpGet("{id}")]
        public ActionResult<Conversation> Get(int id)
        {
            return Ok(_conversationService.GetConversation(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<Conversation>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(_conversationService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public IActionResult Create([FromBody] ConversationCreateModel data)
        {
            var conversation = data.Convert();
            _conversationService.CreateConversation(conversation);
            return CreatedAtAction(nameof(Get), new { id = conversation.ConversationId }, conversation);
        }

        [HttpPut]
        public IActionResult Update([FromBody] Conversation conversation)
        {
            _conversationService.UpdateConversation(conversation);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _conversationService.DeleteConversation(id);
            return result ? NoContent() : NotFound();
        }
    }
}