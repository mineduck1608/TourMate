using Microsoft.AspNetCore.Mvc;
using Repositories.DTO;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/tour-guides")]
    [ApiController]
    public class TourGuideController : ControllerBase
    {
        private readonly ITourGuideService _tourguideService;

        public TourGuideController(ITourGuideService tourguideService)
        {
            _tourguideService = tourguideService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TourGuide>> GetAsync(int id)
        {
            return Ok(await _tourguideService.GetTourGuideAsync(id));
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<TourGuide>>> GetAllAsync([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(await _tourguideService.GetAllAsync(pageSize, pageIndex));
        }

        [HttpPost]
        public IActionResult Create([FromBody] TourGuideCreateModel data)
        {
            var tourguide = data.Convert();
            _tourguideService.CreateTourGuide(tourguide);
            return CreatedAtAction(nameof(GetAsync), new { id = tourguide.TourGuideId }, tourguide);
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