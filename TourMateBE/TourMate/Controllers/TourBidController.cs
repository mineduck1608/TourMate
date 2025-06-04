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
        public async Task<ActionResult<PagedResult<TourBid>>> GetBidsAsync(int? areaId, [FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(await _tourbidService.GetBids(areaId, pageSize, pageIndex));
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] TourBidCreateModel data)
        {
            var tourbid = data.Convert();
            await _tourbidService.CreateTourBid(tourbid);
            return CreatedAtAction(nameof(Get), new { id = tourbid.TourBidId }, tourbid);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateAsync([FromBody] TourBidUpdateModel tourbid)
        {
            await _tourbidService.UpdateTourBid(tourbid.Convert());
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var result = await _tourbidService.DeleteTourBid(id);
            return result ? NoContent() : NotFound();
        }
    }
}