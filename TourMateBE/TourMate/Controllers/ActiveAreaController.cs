using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActiveAreaController : ControllerBase
    {
        private readonly IActiveAreaService _activeareaService;

        public ActiveAreaController(IActiveAreaService activeareaService)
        {
            _activeareaService = activeareaService;
        }

        [HttpGet("{id}")]
        public ActionResult<ActiveArea> Get(int id)
        {
            return Ok(_activeareaService.GetActiveArea(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<ActiveArea>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(_activeareaService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public IActionResult Create([FromBody] ActiveAreaCreateModel data)
        {
            var activearea = data.Convert();
            _activeareaService.CreateActiveArea(activearea);
            return CreatedAtAction(nameof(Get), new { id = activearea.AreaId }, activearea);
        }

        [HttpPut]
        public IActionResult Update([FromBody] ActiveAreaCreateModel data)
        {
            var activearea = data.Convert();
            _activeareaService.UpdateActiveArea(activearea);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _activeareaService.DeleteActiveArea(id);
            return result ? NoContent() : NotFound();
        }
    }
}