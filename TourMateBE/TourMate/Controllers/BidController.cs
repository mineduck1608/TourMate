using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
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
        public IActionResult Create([FromBody] BidCreateModel data)
        {
            var bid = data.Convert();
            _bidService.CreateBid(bid);
            return CreatedAtAction(nameof(Get), new { id = bid.BidId }, bid);
        }

        [HttpPut]
        public IActionResult Update([FromBody] Bid bid)
        {
            _bidService.UpdateBid(bid);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _bidService.DeleteBid(id);
            return result ? NoContent() : NotFound();
        }
    }
}