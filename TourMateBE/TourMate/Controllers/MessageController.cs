using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/messages")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly IMessagesService _messageService;

        public MessageController(IMessagesService messageService)
        {
            _messageService = messageService;
        }

        //[HttpGet("{conversationId}")]
        //public async Task<IActionResult> GetMessages(int conversationId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        //{
        //    var (messages, hasMore) = await _messageService.GetMessagesAsync(conversationId, page, pageSize);

        //    return Ok(new
        //    {
        //        messages,
        //        hasMore
        //    });
        //}

        [HttpGet("{id}")]
        public ActionResult<Message> Get(int id)
        {
            return Ok(_messageService.GetMessages(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<Message>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(_messageService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage([FromBody] MessageCreateModel data)
        {
            var message = data.Convert();
            _messageService.CreateMessages(message);
            return CreatedAtAction(nameof(Get), new { id = message.MessageId }, message);
        }

        // POST: api/messages/{conversationId}/mark-read
        [HttpPost("{conversationId}/mark-read")]
        public async Task<IActionResult> MarkRead(int conversationId, [FromBody] int userId)
        {
            await _messageService.MarkConversationAsRead(conversationId, userId);

            return Ok(new { message = "Đã đánh dấu đọc" });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _messageService.DeleteMessages(id);
            return result ? NoContent() : NotFound();
        }
    }
}