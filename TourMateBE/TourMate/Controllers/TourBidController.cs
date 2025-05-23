using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;

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
        public ActionResult<TourBid> Get(int id)
        {
            return Ok(_tourbidService.GetTourBid(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<TourBid>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(_tourbidService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public IActionResult Create([FromBody] TourBidCreateModel data)
        {
            var tourbid = data.Convert();
            _tourbidService.CreateTourBid(tourbid);
            return CreatedAtAction(nameof(Get), new { id = tourbid.TourBidId }, tourbid);
        }

        [HttpPut]
        public IActionResult Update([FromBody] TourBidCreateModel tourbid)
        {
            _tourbidService.UpdateTourBid(tourbid.Convert());
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _tourbidService.DeleteTourBid(id);
            return result ? NoContent() : NotFound();
        }
    }
}