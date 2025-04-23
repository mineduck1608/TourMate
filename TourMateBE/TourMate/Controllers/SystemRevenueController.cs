using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SystemRevenueController : ControllerBase
    {
        private readonly ISystemRevenueService _systemrevenueService;

        public SystemRevenueController(ISystemRevenueService systemrevenueService)
        {
            _systemrevenueService = systemrevenueService;
        }

        [HttpGet("{id}")]
        public ActionResult<SystemRevenue> Get(int id)
        {
            return Ok(_systemrevenueService.GetSystemRevenue(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<SystemRevenue>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(_systemrevenueService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public IActionResult Create([FromBody] SystemRevenueCreateModel data)
        {
            var systemrevenue = data.Convert();
            _systemrevenueService.CreateSystemRevenue(systemrevenue);
            return CreatedAtAction(nameof(Get), new { id = systemrevenue.SystemRevenueId }, systemrevenue);
        }

        [HttpPut]
        public IActionResult Update([FromBody] SystemRevenueCreateModel systemrevenue)
        {
            _systemrevenueService.UpdateSystemRevenue(systemrevenue.Convert());
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _systemrevenueService.DeleteSystemRevenue(id);
            return result ? NoContent() : NotFound();
        }
    }
}