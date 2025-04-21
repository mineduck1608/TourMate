using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CvapplicationController : ControllerBase
    {
        private readonly ICvapplicationService _cvapplicationService;

        public CvapplicationController(ICvapplicationService cvapplicationService)
        {
            _cvapplicationService = cvapplicationService;
        }

        [HttpGet("{id}")]
        public ActionResult<Cvapplication> Get(int id)
        {
            return Ok(_cvapplicationService.GetCvapplication(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<Cvapplication>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(_cvapplicationService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public IActionResult Create([FromBody] CvapplicationsCreateModel data)
        {
            var cvapplication = data.Convert();
            _cvapplicationService.CreateCvapplication(cvapplication);
            return CreatedAtAction(nameof(Get), new { id = cvapplication.CvApplicationId }, cvapplication);
        }

        [HttpPut]
        public IActionResult Update([FromBody] CvapplicationsCreateModel cvapplication)
        {
            _cvapplicationService.UpdateCvapplication(cvapplication.Convert());
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _cvapplicationService.DeleteCvapplication(id);
            return result ? NoContent() : NotFound();
        }
    }
}