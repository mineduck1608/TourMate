using Microsoft.AspNetCore.Mvc;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TourGuideDescController : ControllerBase
    {
        private readonly ITourGuideDescService _tourguidedescService;

        public TourGuideDescController(ITourGuideDescService tourguidedescService)
        {
            _tourguidedescService = tourguidedescService;
        }

        [HttpGet("{id}")]
        public ActionResult<TourGuideDesc> Get(int id)
        {
            return Ok(_tourguidedescService.GetTourGuideDesc(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<TourGuideDesc>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(_tourguidedescService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public IActionResult Create([FromBody] TourGuideDesc tourguidedesc)
        {
            _tourguidedescService.CreateTourGuideDesc(tourguidedesc);
            return CreatedAtAction(nameof(Get), new { id = tourguidedesc.TourGuideDescId }, tourguidedesc);
        }

        [HttpPut]
        public IActionResult Update([FromBody] TourGuideDesc tourguidedesc)
        {
            _tourguidedescService.UpdateTourGuideDesc(tourguidedesc);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _tourguidedescService.DeleteTourGuideDesc(id);
            return result ? NoContent() : NotFound();
        }
    }
}