using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/account-memberships")]
    [ApiController]
    public class AccountMembershipController : ControllerBase
    {
        private readonly IAccountMembershipService _accountmembershipService;

        public AccountMembershipController(IAccountMembershipService accountmembershipService)
        {
            _accountmembershipService = accountmembershipService;
        }

        [HttpGet("{id}")]
        public ActionResult<AccountMembership> Get(int id)
        {
            return Ok(_accountmembershipService.GetAccountMembership(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<AccountMembership>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(_accountmembershipService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public IActionResult Create([FromBody] AccountMembershipCreateModel data)
        {
            var accountmembership = data.Convert();
            _accountmembershipService.CreateAccountMembership(accountmembership);
            return CreatedAtAction(nameof(Get), new { id = accountmembership.AccountMembershipId }, accountmembership);
        }

        [HttpPut]
        public IActionResult Update([FromBody] AccountMembershipCreateModel data)
        {
            var accountmembership = data.Convert();
            _accountmembershipService.UpdateAccountMembership(accountmembership);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _accountmembershipService.DeleteAccountMembership(id);
            return result ? NoContent() : NotFound();
        }
    }
}