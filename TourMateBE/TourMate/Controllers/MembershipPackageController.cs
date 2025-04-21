using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MembershipPackageController : ControllerBase
    {
        private readonly IMembershipPackagesService _membershippackageService;

        public MembershipPackageController(IMembershipPackagesService membershippackageService)
        {
            _membershippackageService = membershippackageService;
        }

        [HttpGet("{id}")]
        public ActionResult<MembershipPackage> Get(int id)
        {
            return Ok(_membershippackageService.GetMembershipPackages(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<MembershipPackage>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(_membershippackageService.GetAll(pageSize, pageIndex));
        }

        [HttpPost]
        public IActionResult Create([FromBody] MembershipPackageCreateModel data)
        {
            var membershippackage = data.Convert();
            _membershippackageService.CreateMembershipPackages(membershippackage);
            return CreatedAtAction(nameof(Get), new { id = membershippackage.MembershipPackageId }, membershippackage);
        }

        [HttpPut]
        public IActionResult Update([FromBody] MembershipPackageCreateModel membershippackage)
        {
            _membershippackageService.UpdateMembershipPackages(membershippackage.Convert());
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _membershippackageService.DeleteMembershipPackages(id);
            return result ? NoContent() : NotFound();
        }
    }
}