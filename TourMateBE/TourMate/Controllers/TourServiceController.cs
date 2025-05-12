using Microsoft.AspNetCore.Mvc;
using Repositories.DTO;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/tour-services")]
    [ApiController]
    public class TourServiceController : ControllerBase
    {
        private readonly ITourServicesService _tourserviceService;

        public TourServiceController(ITourServicesService tourserviceService)
        {
            _tourserviceService = tourserviceService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TourService>> GetAsync(int id)
        {
            return Ok(await _tourserviceService.GetTourServices(id));
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<TourService>>> GetAllAsync([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(await _tourserviceService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] TourServiceCreateModel data)
        {
            var tourservice = data.Convert();
            await _tourserviceService.CreateTourServices(tourservice);
            return CreatedAtAction(nameof(GetAsync), new { id = tourservice.ServiceId }, tourservice);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateAsync([FromBody] TourServiceCreateModel tourservice)
        {
            await _tourserviceService.UpdateTourServices(tourservice.Convert());
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var result = await _tourserviceService.DeleteTourServices(id);
            return result ? NoContent() : NotFound();
        }
    }
}