using Microsoft.AspNetCore.Mvc;
using Repositories.DTO;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;
        
        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpPost("login")]
        public ActionResult<AuthResponse> Login(string email, [FromBody] string password)
        {
            return Ok(_accountService.LoginAsync(email, password));
        }

        [HttpGet("{id}")]
        public ActionResult<Account> Get(int id)
        {
            return Ok(_accountService.GetAccount(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<Account>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(_accountService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public IActionResult Create([FromBody] Account account)
        {
            _accountService.CreateAccount(account);
            return CreatedAtAction(nameof(Get), new { id = account.AccountId }, account);
        }

        [HttpPut]
        public IActionResult Update([FromBody] Account account)
        {
            _accountService.UpdateAccount(account);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _accountService.DeleteAccount(id);
            return result ? NoContent() : NotFound();
        }
    }
}