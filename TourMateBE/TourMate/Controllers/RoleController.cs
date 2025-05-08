using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/roles")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RoleController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        [HttpGet("{id}")]
        public ActionResult<Role> Get(int id)
        {
            return Ok(_roleService.GetRole(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<Role>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(_roleService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public IActionResult Create([FromBody] RoleCreateModel data)
        {
            var role = data.Convert();
            _roleService.CreateRole(role);
            return CreatedAtAction(nameof(Get), new { id = role.RoleId }, role);
        }

        [HttpPut]
        public IActionResult Update([FromBody] RoleCreateModel role)
        {
            _roleService.UpdateRole(role.Convert());
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _roleService.DeleteRole(id);
            return result ? NoContent() : NotFound();
        }
    }
}