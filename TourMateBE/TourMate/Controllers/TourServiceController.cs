using Microsoft.AspNetCore.Mvc;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TourServiceController : ControllerBase
    {
        private readonly ITourServicesService _tourserviceService;

        public TourServiceController(ITourServicesService tourserviceService)
        {
            _tourserviceService = tourserviceService;
        }

        [HttpGet("{id}")]
        public ActionResult<TourService> Get(int id)
        {
            return Ok(_tourserviceService.GetTourServices(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<TourService>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(_tourserviceService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public IActionResult Create([FromBody] TourService tourservice)
        {
            _tourserviceService.CreateTourServices(tourservice);
            return CreatedAtAction(nameof(Get), new { id = tourservice.ServiceId }, tourservice);
        }

        [HttpPut]
        public IActionResult Update([FromBody] TourService tourservice)
        {
            _tourserviceService.UpdateTourServices(tourservice);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _tourserviceService.DeleteTourServices(id);
            return result ? NoContent() : NotFound();
        }
    }
}