using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/refresh-tokens")]
    [ApiController]
    public class RefreshTokenController : ControllerBase
    {
        private readonly IRefreshTokenService _refreshtokenService;

        public RefreshTokenController(IRefreshTokenService refreshtokenService)
        {
            _refreshtokenService = refreshtokenService;
        }

        [HttpGet("{id}")]
        public ActionResult<RefreshToken> Get(string id)
        {
            return Ok(_refreshtokenService.GetByRefreshToken(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<RefreshToken>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(_refreshtokenService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public IActionResult Create([FromBody] RefreshTokenCreateModel data)
        {
            var refreshtoken = data.Convert();
            _refreshtokenService.CreateRefreshToken(refreshtoken);
            return CreatedAtAction(nameof(Get), new { id = refreshtoken.Id }, refreshtoken);
        }

        [HttpPut]
        public IActionResult Update([FromBody] RefreshTokenCreateModel refreshtoken)
        {
            _refreshtokenService.UpdateRefreshToken(refreshtoken.Convert());
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _refreshtokenService.DeleteRefreshToken(id);
            return result ? NoContent() : NotFound();
        }
    }
}