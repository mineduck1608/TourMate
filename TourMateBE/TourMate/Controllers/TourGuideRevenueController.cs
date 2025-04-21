using Microsoft.AspNetCore.Mvc;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TourGuideRevenueController : ControllerBase
    {
        private readonly ITourGuideRevenueService _tourguiderevenueService;

        public TourGuideRevenueController(ITourGuideRevenueService tourguiderevenueService)
        {
            _tourguiderevenueService = tourguiderevenueService;
        }

        [HttpGet("{id}")]
        public ActionResult<TourGuideRevenue> Get(int id)
        {
            return Ok(_tourguiderevenueService.GetTourGuideRevenue(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<TourGuideRevenue>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(_tourguiderevenueService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public IActionResult Create([FromBody] TourGuideRevenue tourguiderevenue)
        {
            _tourguiderevenueService.CreateTourGuideRevenue(tourguiderevenue);
            return CreatedAtAction(nameof(Get), new { id = tourguiderevenue.TourGuideRevenue1 }, tourguiderevenue);
        }

        [HttpPut]
        public IActionResult Update([FromBody] TourGuideRevenue tourguiderevenue)
        {
            _tourguiderevenueService.UpdateTourGuideRevenue(tourguiderevenue);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _tourguiderevenueService.DeleteTourGuideRevenue(id);
            return result ? NoContent() : NotFound();
        }
    }
}