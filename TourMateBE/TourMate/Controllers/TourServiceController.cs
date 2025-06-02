using Microsoft.AspNetCore.Mvc;
using Repositories.DTO;
using Repositories.DTO.CreateModels;
using Repositories.DTO.UpdateModals;
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
        public async Task<IActionResult> Create([FromBody] TourServiceCreateModel data)
        {
            var tourservice = data.Convert();
            await _tourserviceService.CreateTourServices(tourservice);
            return CreatedAtAction(nameof(Create), new { id = tourservice.ServiceId }, tourservice);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateAsync([FromBody] TourServiceEditModel tourservice)
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
        [HttpGet("services-of")]
        public async Task<ActionResult<PagedResult<TourService>>> TourServicesOf(int tourGuideId, int pageSize = 3, int pageIndex = 1)
        {
            return Ok(await _tourserviceService.GetTourServicesOf(tourGuideId, pageSize, pageIndex));
        }

        [HttpGet("other-services-of")]
        public async Task<IActionResult> GetOtherTourServices([FromQuery] int tourGuideId, [FromQuery] int serviceId, [FromQuery] int pageSize)
        {
            try
            {
                var result = await _tourserviceService.GetOtherTourServicesAsync(tourGuideId, serviceId, pageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong", error = ex.Message });
            }
        }
    }
}