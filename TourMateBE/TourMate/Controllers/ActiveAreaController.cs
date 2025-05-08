using Microsoft.AspNetCore.Mvc;
using Repositories.DTO;
using Repositories.DTO.CreateModels;
using Repositories.DTO.UpdateModals;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/active-area")]
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
        public async Task<ActionResult<PagedResult<ActiveArea>>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
           var result = await _activeareaService.GetAll(pageSize, pageIndex);
            var response = new PagedResult<ActiveArea>
            {
                Result = result.Result, // Tin tức đã bọc trong "Data"
                TotalResult = result.TotalResult, // Tổng số kết quả
                TotalPage = result.TotalPage // Tổng số trang
            };
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ActiveAreaCreateModel data)
        {
            var activearea = data.Convert();
            var result = await _activeareaService.CreateActiveArea(activearea);
            if(result == true)
            {
                return Ok();
            }
            return BadRequest();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromBody] ActiveAreaUpdateModal data)
        {
            var activearea = data.Convert();
            var result = await _activeareaService.UpdateActiveArea(activearea);
            if (result == true)
            {
                return Ok();
            }
            return BadRequest();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _activeareaService.DeleteActiveArea(id);
            return result ? NoContent() : NotFound();
        }
    }
}