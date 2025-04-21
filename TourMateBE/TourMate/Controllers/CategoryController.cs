using Microsoft.AspNetCore.Mvc;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet("{id}")]
        public ActionResult<Category> Get(int id)
        {
            return Ok(_categoryService.GetCategory(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<Category>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(_categoryService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public IActionResult Create([FromBody] Category category)
        {
            _categoryService.CreateCategory(category);
            return CreatedAtAction(nameof(Get), new { id = category.CategoryId }, category);
        }

        [HttpPut]
        public IActionResult Update([FromBody] Category category)
        {
            _categoryService.UpdateCategory(category);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _categoryService.DeleteCategory(id);
            return result ? NoContent() : NotFound();
        }
    }
}