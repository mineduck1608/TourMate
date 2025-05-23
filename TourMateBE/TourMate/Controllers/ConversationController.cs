using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/conversations")]
    [ApiController]
    public class ConversationController : ControllerBase
    {
        private readonly IConversationService _conversationService;

        public ConversationController(IConversationService conversationService)
        {
            _conversationService = conversationService;
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
        public async Task<IActionResult> GetMessages(int conversationId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var (messages, hasMore) = await _conversationService.GetMessagesAsync(conversationId, page, pageSize);

            return Ok(new
            {
                messages,
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