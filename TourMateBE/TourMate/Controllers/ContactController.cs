using Microsoft.AspNetCore.Mvc;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly IContactService _contactService;

        public ContactController(IContactService contactService)
        {
            _contactService = contactService;
        }

        [HttpGet("{id}")]
        public ActionResult<Contact> Get(int id)
        {
            return Ok(_contactService.GetContact(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<Contact>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(_contactService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public IActionResult Create([FromBody] Contact contact)
        {
            _contactService.CreateContact(contact);
            return CreatedAtAction(nameof(Get), new { id = contact.ContactId }, contact);
        }

        [HttpPut]
        public IActionResult Update([FromBody] Contact contact)
        {
            _contactService.UpdateContact(contact);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _contactService.DeleteContact(id);
            return result ? NoContent() : NotFound();
        }
    }
}