using Microsoft.AspNetCore.Mvc;
using Repositories.DTO;
using Repositories.DTO.CreateModels;
using Repositories.DTO.UpdateModels;
using Repositories.Models;
using Services;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/tour-bids")]
    [ApiController]
    public class TourBidController : ControllerBase
    {
        private readonly ITourBidService _tourbidService;

        public TourBidController(ITourBidService tourbidService)
        {
            _tourbidService = tourbidService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TourBid>> Get(int id)
        {
            return Ok(await _tourbidService.GetTourBid(id));
        }

        [HttpGet("bids-of")]
        public async Task<ActionResult<PagedResult<TourBid>>> GetBidsOfAsync(int accountId, [FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(await _tourbidService.GetBidsOf(accountId, pageSize, pageIndex));
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<TourBidListResult>>> GetBidsAsync(string? content, int accountIdFrom, [FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(await _tourbidService.GetBids(content, accountIdFrom, pageSize, pageIndex));
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] TourBidCreateModel data)
        {
            var tourbid = data.Convert();
            var r = await _tourbidService.CreateTourBid(tourbid);
            return r ? CreatedAtAction(nameof(Get), new { id = tourbid.TourBidId }, tourbid) : BadRequest();
        }

        [HttpPut]
        public async Task<IActionResult> UpdateAsync([FromBody] TourBidUpdateModel tourbid)
        {
            var r = await _tourbidService.UpdateTourBid(tourbid.Convert());
            return r ? NoContent() : BadRequest();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var result = await _tourbidService.DeleteTourBid(id);
            return result ? NoContent() : NotFound();
        }
        [HttpPost("like-or-unlike")]
        public async Task<IActionResult> LikeOrUnlikeBid(int accountId, int tourBidId)
        {
            var result = await _tourbidService.LikeOrUnlikeBid(accountId, tourBidId);
            return result ? NoContent() : BadRequest();
        }
    }
}