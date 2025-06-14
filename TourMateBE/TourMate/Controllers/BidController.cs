using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.DTO.ResultModels;
using Repositories.DTO.UpdateModels;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/bids")]
    [ApiController]
    public class BidController : ControllerBase
    {
        private readonly IBidService _bidService;

        public BidController(IBidService bidService)
        {
            _bidService = bidService;
        }

        [HttpGet("{id}")]
        public ActionResult<Bid> Get(int id)
        {
            return Ok(_bidService.GetBid(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<Bid>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(_bidService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] BidCreateModel data)
        {
            var bid = data.Convert();
            var result = await _bidService.CreateBid(bid);
            return result ? CreatedAtAction(nameof(Get), new { id = bid.BidId }, bid) : BadRequest();
        }

        [HttpPut]
        public async Task<IActionResult> UpdateAsync([FromBody] BidUpdateModel bid)
        {
            var result = await _bidService.UpdateBid(bid.Convert());
            return result ? NoContent() : BadRequest();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var result = await _bidService.DeleteBid(id);
            return result ? NoContent() : NotFound();
        }
        [HttpGet("tour/{tourBid}")]
        public async Task<ActionResult<PagedResult<BidListResult>>> GetBidsOfTourBid(int tourBid, [FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            var result = await _bidService.GetBidsOfTourBid(tourBid, pageSize, pageIndex);
            return Ok(result);
        }
        [HttpPost("accept/{bidId}")]
        public async Task<IActionResult> AcceptBid(int bidId)
        {
            var result = await _bidService.AcceptBid(bidId);
            return result ? NoContent() : NotFound();
        }
    }
}