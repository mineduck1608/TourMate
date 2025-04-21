using Microsoft.AspNetCore.Mvc;
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
        public IActionResult Create([FromBody] SystemRevenue systemrevenue)
        {
            _systemrevenueService.CreateSystemRevenue(systemrevenue);
            return CreatedAtAction(nameof(Get), new { id = systemrevenue.SystemRevenueId }, systemrevenue);
        }

        [HttpPut]
        public IActionResult Update([FromBody] SystemRevenue systemrevenue)
        {
            _systemrevenueService.UpdateSystemRevenue(systemrevenue);
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