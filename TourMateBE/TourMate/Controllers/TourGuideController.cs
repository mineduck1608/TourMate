using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TourGuideController : ControllerBase
    {
        private readonly ITourGuideService _tourguideService;

        public TourGuideController(ITourGuideService tourguideService)
        {
            _tourguideService = tourguideService;
        }

        [HttpGet("{id}")]
        public ActionResult<TourGuide> Get(int id)
        {
            return Ok(_tourguideService.GetTourGuide(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<TourGuide>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(_tourguideService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public IActionResult Create([FromBody] TourGuideCreateModel data)
        {
            var tourguide = data.Convert();
            _tourguideService.CreateTourGuide(tourguide);
            return CreatedAtAction(nameof(Get), new { id = tourguide.TourGuideId }, tourguide);
        }

        [HttpPut]
        public IActionResult Update([FromBody] TourGuideCreateModel tourguide)
        {
            _tourguideService.UpdateTourGuide(tourguide.Convert());
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _tourguideService.DeleteTourGuide(id);
            return result ? NoContent() : NotFound();
        }
    }
}