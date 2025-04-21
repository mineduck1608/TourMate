using Microsoft.AspNetCore.Mvc;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsCategoryController : ControllerBase
    {
        private readonly INewsCategoryService _newscategoryService;

        public NewsCategoryController(INewsCategoryService newscategoryService)
        {
            _newscategoryService = newscategoryService;
        }

        [HttpGet("{id}")]
        public ActionResult<NewsCategory> Get(int id)
        {
            return Ok(_newscategoryService.GetNewsCategory(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<NewsCategory>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(_newscategoryService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public IActionResult Create([FromBody] NewsCategory newscategory)
        {
            _newscategoryService.CreateNewsCategory(newscategory);
            return CreatedAtAction(nameof(Get), new { id = newscategory.NewsCategoryId }, newscategory);
        }

        [HttpPut]
        public IActionResult Update([FromBody] NewsCategory newscategory)
        {
            _newscategoryService.UpdateNewsCategory(newscategory);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _newscategoryService.DeleteNewsCategory(id);
            return result ? NoContent() : NotFound();
        }
    }
}