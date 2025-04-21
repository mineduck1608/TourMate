using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly IMessagesService _messageService;

        public MessageController(IMessagesService messageService)
        {
            _messageService = messageService;
        }

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
        public IActionResult Create([FromBody] MessageCreateModel data)
        {
            var message = data.Convert();
            _messageService.CreateMessages(message);
            return CreatedAtAction(nameof(Get), new { id = message.MessageId }, message);
        }

        [HttpPut]
        public IActionResult Update([FromBody] MessageCreateModel message)
        {
            _messageService.UpdateMessages(message.Convert());
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _messageService.DeleteMessages(id);
            return result ? NoContent() : NotFound();
        }
    }
}