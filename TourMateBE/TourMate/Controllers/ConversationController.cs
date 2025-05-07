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
            return CreatedAtAction(nameof(Get), new { id = conversation.ConersationId }, conversation);
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