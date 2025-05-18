using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;
using Services.Utils;

namespace API.Controllers
{
    [Route("api/tour-guides")]
    [ApiController]
    public class TourGuideController : ControllerBase
    {
        private readonly ITourGuideService _tourguideService;
        private readonly IAccountService _accountService;

        public TourGuideController(ITourGuideService tourguideService, IAccountService accountService)
        {
            _tourguideService = tourguideService;
            _accountService = accountService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TourGuide>> GetAsync(int id)
        {
            return Ok(await _tourguideService.GetTourGuideAsync(id));
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<TourGuide>>> GetAllAsync([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(await _tourguideService.GetAllAsync(pageSize, pageIndex));
        }

        //[HttpPost]
        //public async Task<IActionResult> Create([FromBody] Customer data)
        //{

        //    if (!ValidInput.IsPhoneFormatted(data.Phone.Trim()))
        //        return BadRequest(new { msg = "Số điện thoại không đúng!" });
        //    if (!ValidInput.IsMailFormatted(data.Account.Email))
        //        return BadRequest(new { msg = "Email không đúng định dạng!" });
        //    if (!ValidInput.IsPasswordSecure(data.Account.Password))
        //        return BadRequest(new { msg = "Mật khẩu chưa đủ bảo mật!" });

        //    // Kiểm tra tài khoản đã tồn tại
        //    var existingAccount = await _accountService.GetAccountByEmail(data.Account.Email);
        //    if (existingAccount != null)
        //        return Conflict(new { msg = "Tài khoảng đã tồn tại!" });

        //    var existingPhone = await _tourguideService.GetCustomerByPhone(data.Phone);
        //    if (existingPhone != null)
        //        return Conflict(new { msg = "Số điện thoại đã được sử dụng!" });

        //    if (data.DateOfBirth >= DateOnly.FromDateTime(DateTime.Now))
        //    {
        //        return BadRequest(new { msg = "Ngày sinh không đúng!" });
        //    }

        //    var isAccountCreated = await _accountService.CreateAccountAdmin(data.Account);
        //    if (isAccountCreated != null)
        //    {
        //        data.AccountId = isAccountCreated.AccountId;
        //        var result = await _tourguideService.CreateCustomer(data);
        //        if (result == true)
        //        {
        //            return Ok();
        //        }
        //        else return BadRequest();
        //    }
        //    return BadRequest();
        //}

        [HttpPut]
        public IActionResult Update([FromBody] TourGuideCreateModel tourguide)
        {
            _tourguideService.UpdateTourGuide(tourguide.Convert());
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _tourguideService.DeleteTourGuide(id);
            return result ? NoContent() : NotFound();
        }
    }
}