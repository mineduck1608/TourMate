using Microsoft.AspNetCore.Mvc;
using Repositories.DTO;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;
using Services.Utils;

namespace API.Controllers
{
    [Route("api/tour-guide")]
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
            return Ok(await _tourguideService.GetTourGuide(id));
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<TourGuide>>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1, [FromQuery] string phone = "")
        {
            var result = await _tourguideService.GetAll(pageSize, pageIndex, phone);

            var response = new PagedResult<TourGuide>
            {
                Result = result.Result,
                TotalResult = result.TotalResult,  // Tổng số kết quả
                TotalPage = result.TotalPage  // Tổng số trang
            };

            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TourGuide data)
        {

            if (!ValidInput.IsPhoneFormatted(data.Phone.Trim()))
                return BadRequest(new { msg = "Số điện thoại không đúng!" });
            if (!ValidInput.IsMailFormatted(data.Account.Email))
                return BadRequest(new { msg = "Email không đúng định dạng!" });
            if (!ValidInput.IsPasswordSecure(data.Account.Password))
                return BadRequest(new { msg = "Mật khẩu chưa đủ bảo mật!" });

            // Kiểm tra tài khoản đã tồn tại
            var existingAccount = await _accountService.GetAccountByEmail(data.Account.Email);
            if (existingAccount != null)
                return Conflict(new { msg = "Tài khoảng đã tồn tại!" });

            var existingPhone = await _tourguideService.GetTourGuideByPhone(data.Phone);
            if (existingPhone != null)
                return Conflict(new { msg = "Số điện thoại đã được sử dụng!" });

            if (data.DateOfBirth >= DateOnly.FromDateTime(DateTime.Now))
            {
                return BadRequest(new { msg = "Ngày sinh không đúng!" });
            }

            data.Account.Password = HashString.ToHashString(data.Account.Password);
            var isAccountCreated = await _accountService.CreateAccountAdmin(data.Account);
            if (isAccountCreated != null)
            {
                data.AccountId = isAccountCreated.AccountId;
                data.Account = null;
                var result = await _tourguideService.CreateTourGuide(data);
                if (result == true)
                {
                    return Ok();
                }
                else return BadRequest();
            }
            return BadRequest();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromBody] TourGuideUpdateModel data)
        {
            var tourGuide = data.Convert();
            if (!ValidInput.IsPhoneFormatted(tourGuide.Phone.Trim()))
                return BadRequest(new { msg = "Số điện thoại không đúng!" });
            if (!ValidInput.IsMailFormatted(tourGuide.Account.Email))
                return BadRequest(new { msg = "Email không đúng định dạng!" });
            if (!ValidInput.IsPasswordSecure(tourGuide.Account.Password))
                return BadRequest(new { msg = "Mật khẩu chưa đủ bảo mật!" });

            // Kiểm tra tài khoản đã tồn tại
            var existingAccount = await _accountService.GetAccountByEmail(tourGuide.Account.Email);
            if (existingAccount != null && existingAccount.AccountId != tourGuide.Account.AccountId)
                return Conflict(new { msg = "Tài khoản đã tồn tại!" });


            var existingPhone = await _tourguideService.GetTourGuideByPhone(tourGuide.Phone);
            if (existingPhone != null && existingPhone.TourGuideId != tourGuide.TourGuideId)
                return Conflict(new { msg = "Số điện thoại đã được sử dụng!" });

            if (tourGuide.DateOfBirth >= DateOnly.FromDateTime(DateTime.Now))
            {
                return BadRequest(new { msg = "Ngày sinh không đúng!" });
            }

            tourGuide.Account.Password = HashString.ToHashString(tourGuide.Account.Password);
            var updateTourGuide = await _tourguideService.UpdateTourGuide(tourGuide);
            var updateAccount = await _accountService.UpdateAccount(tourGuide.Account);
            if (updateTourGuide == true && updateAccount == true)
            {
                return Ok();
            }
            return BadRequest();
        }


        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _tourguideService.DeleteTourGuide(id);
            return result ? NoContent() : NotFound();
        }
    }
}