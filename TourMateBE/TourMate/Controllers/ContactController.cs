using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.DTO.ResultModels;
using Repositories.Models;
using Services;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/contact")]
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

        public async Task<ActionResult<PagedResult<Contact>>> GetAll(int pageSize = 10, int pageIndex = 1)
        {
            var result = await _contactService.GetAll(pageSize, pageIndex);
            var response = new PagedResult<Contact>
            {
                Result = result.Result, // Tin tức đã bọc trong "Data"
                TotalResult = result.TotalResult, // Tổng số kết quả
                TotalPage = result.TotalPage // Tổng số trang
            };
            return Ok(result);
        }


        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ContactCreateModel data)
        {
            var contact = data.Convert();
            var result = await _contactService.CreateContact(contact);
            if (result == true)
            {
                return Ok();
            }
            return BadRequest();
        }

        [HttpPut]
        public IActionResult Update([FromBody] ContactCreateModel contact)
        {
            _contactService.UpdateContact(contact.Convert());
            return NoContent();
        }

        [HttpPut("confirm/{id}")]
        public async Task<IActionResult> ConfirmContact(int id)
        {
            var contact = await _contactService.GetContact(id);
            if(contact.IsProcessed == true)
            {
                return BadRequest(new { msg = "Liên hệ này đã được xác nhận!" });
            }
            contact.IsProcessed = true;
            var result = await _contactService.UpdateContact(contact);
            if(result == false)
            {
                return BadRequest(new { msg = "Xác nhận liên hệ không thành công!" });

            }
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _contactService.DeleteContact(id);
            return result ? NoContent() : NotFound();
        }
    }
}