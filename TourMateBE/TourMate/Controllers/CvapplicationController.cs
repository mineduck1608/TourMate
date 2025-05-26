using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;
using Services.Utils;
using System.Numerics;

namespace API.Controllers
{
    [Route("api/cv-applications")]
    [ApiController]
    public class CvapplicationController : ControllerBase
    {
        private readonly ICvapplicationService _cvapplicationService;
        private readonly IAccountService _accountService;
        private readonly ICustomerService _customerService;

        public CvapplicationController(ICvapplicationService cvapplicationService, IAccountService accountService, ICustomerService customerService)
        {
            _cvapplicationService = cvapplicationService;
            _accountService = accountService;
            _customerService = customerService;
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
        public async Task<IActionResult> Create([FromBody] CvapplicationsCreateModel data)
        {
            if (!ValidInput.IsPhoneFormatted(data.Phone.Trim()))
                return BadRequest(new { msg = "Số điện thoại không đúng!" });

            if (!ValidInput.IsMailFormatted(data.Email))
                return BadRequest(new { msg = "Email không đúng định dạng!" });

            // Kiểm tra tài khoản đã tồn tại
            var existingAccount = await _accountService.GetAccountByEmail(data.Email);
            if (existingAccount != null)
                return Conflict("Email này đã được sử dụng!");

            var existingPhone = await _customerService.GetCustomerByPhone(data.Phone);
            if (existingPhone != null)
                return Conflict("Số điện thoại này đã được sử dụng!");

            var cvapplication = data.Convert();
            var result = await _cvapplicationService.CreateCvapplication(cvapplication);
            if (!result) return BadRequest(new { msg = "Tạo hồ sơ ứng tuyển thất bại." });
            return Ok(new { msg = "Tạo hồ sơ ứng tuyển thành công, bạn sẽ nhận được thông tin phản hồi trong thời gian sớm nhất." });
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