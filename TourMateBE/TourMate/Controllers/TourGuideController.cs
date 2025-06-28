using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.UpdateModels;
using Repositories.Models;
using Repositories.RequestModels.CreateModels;
using Repositories.ResponseModels;
using Services.IServices;
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

        [HttpGet("from-account/{accountId}")]
        public async Task<IActionResult> GetTourGuideFromAccount(int accountId)
        {
            var result = await _tourguideService.GetTourGuideByAccountIdAsync(accountId);
            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpGet("get-by-accountid/{accountId}")]
        public async Task<IActionResult> GetTourGuideByAccountId(int accountId)
        {
            var result = await _tourguideService.GetTourGuideByAccId(accountId);
            if (result == null)
                return NotFound();

            return Ok(result);
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

            return Ok(result);
        }
        [HttpGet("get-list")]
        public async Task<ActionResult<PagedResult<TourGuide>>> GetFromClient(int? areaId, string? name = "", int pageSize = 10, int pageIndex = 1)
        {
            var result = await _tourguideService.GetList(pageSize, pageIndex, name, areaId);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TourGuideAdminCreate data)
        {
            // Validate phone
            if (!ValidInput.IsPhoneFormatted(data.Phone.Trim()))
                return BadRequest(new { msg = "Số điện thoại không đúng!" });

            // Validate email
            if (!ValidInput.IsMailFormatted(data.Account.Email))
                return BadRequest(new { msg = "Email không đúng định dạng!" });

            // Validate password
            if (!ValidInput.IsPasswordSecure(data.Account.Password))
                return BadRequest(new { msg = "Mật khẩu cần có ít nhất 12 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt." });

            // Check account exists
            var existingAccount = await _accountService.GetAccountByEmail(data.Account.Email);
            if (existingAccount != null)
                return Conflict(new { msg = "Tài khoản đã tồn tại!" });

            // Check phone exists
            var existingPhone = await _tourguideService.GetTourGuideByPhone(data.Phone);
            if (existingPhone != null)
                return Conflict(new { msg = "Số điện thoại đã được sử dụng!" });

            // Validate date of birth
            if (data.DateOfBirth >= DateOnly.FromDateTime(DateTime.Now))
                return BadRequest(new { msg = "Ngày sinh không đúng!" });

            // Hash password and create account
            var hashedPassword = HashString.ToHashString(data.Account.Password);
            var newAccount = new Account
            {
                Email = data.Account.Email,
                Password = hashedPassword,
                RoleId = 3, // TourGuide role
                Status = true,
                CreatedDate = DateTime.UtcNow
            };

            var isAccountCreated = await _accountService.CreateAccountAdmin(newAccount);
            if (isAccountCreated == null)
                return BadRequest(new { msg = "Tạo tài khoản thất bại!" });

            // Map TourGuide entity
            var newTourGuide = new TourGuide
            {
                FullName = data.FullName,
                Gender = data.Gender,
                DateOfBirth = data.DateOfBirth,
                Address = data.Address,
                Image = data.Image,
                BannerImage = data.BannerImage,
                Phone = data.Phone,
                IsVerified = data.IsVerified,
                AccountId = isAccountCreated.AccountId,
                TourGuideDescs = data.TourGuideDescs.Select(desc => new TourGuideDesc
                {
                    YearOfExperience = desc.YearOfExperience,
                    Description = desc.Description,
                    AreaId = desc.AreaId,
                    Company = desc.Company
                }).ToList()
            };

            var result = await _tourguideService.CreateTourGuide(newTourGuide);
            return result ? Ok(new { msg = "Tạo hướng dẫn viên thành công!" }) : BadRequest(new { msg = "Tạo hướng dẫn viên thất bại!" });
        }
        //public async Task<IActionResult> Create([FromBody] TourGuide data)
        //{

        //    if (!ValidInput.IsPhoneFormatted(data.Phone.Trim()))
        //        return BadRequest(new { msg = "Số điện thoại không đúng!" });
        //    if (!ValidInput.IsMailFormatted(data.Account.Email))
        //        return BadRequest(new { msg = "Email không đúng định dạng!" });
        //    if (!ValidInput.IsPasswordSecure(data.Account.Password))
        //        return BadRequest(new { msg = "Mật khẩu cần có ít nhất 12 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt." });

        //    // Kiểm tra tài khoản đã tồn tại
        //    var existingAccount = await _accountService.GetAccountByEmail(data.Account.Email);
        //    if (existingAccount != null)
        //        return Conflict(new { msg = "Tài khoảng đã tồn tại!" });

        //    var existingPhone = await _tourguideService.GetTourGuideByPhone(data.Phone);
        //    if (existingPhone != null)
        //        return Conflict(new { msg = "Số điện thoại đã được sử dụng!" });

        //    if (data.DateOfBirth >= DateOnly.FromDateTime(DateTime.Now))
        //    {
        //        return BadRequest(new { msg = "Ngày sinh không đúng!" });
        //    }

        //    data.Account.Password = HashString.ToHashString(data.Account.Password);
        //    data.Account.RoleId = 3;


        //    var isAccountCreated = await _accountService.CreateAccountAdmin(data.Account);
        //    if (isAccountCreated != null)
        //    {
        //        data.AccountId = isAccountCreated.AccountId;
        //        data.Account = null;
        //        var result = await _tourguideService.CreateTourGuide(data);
        //        if (result == true)
        //        {
        //            return Ok();
        //        }
        //        else return BadRequest();
        //    }
        //    return BadRequest();
        //}

        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromBody] TourGuideAdminUpdateModel data)
        {
            if (!ValidInput.IsPhoneFormatted(data.Phone.Trim()))
                return BadRequest(new { msg = "Số điện thoại không đúng!" });
            if (!ValidInput.IsMailFormatted((string)data.Email))
                return base.BadRequest(new { msg = "Email không đúng định dạng!" });
            

            // Kiểm tra tài khoản đã tồn tại
            var existingAccount = await _accountService.GetAccountByEmail((string)data.Email);
            if (existingAccount != null && existingAccount.AccountId != data.AccountId)
                return Conflict(new { msg = "Tài khoản đã tồn tại!" });


            var existingTourGuideByPhone = await _tourguideService.GetTourGuideByPhone((string)data.Phone);
            if (existingTourGuideByPhone != null && existingTourGuideByPhone.TourGuideId != data.TourGuideId)
                return Conflict(new { msg = "Số điện thoại đã được sử dụng!" });

            var account = await _accountService.GetAccount(data.AccountId);
            if (account == null) return BadRequest(new { msg = "Tài khoản không đúng!" });

            if (data.DateOfBirth >= DateOnly.FromDateTime(DateTime.Now))
            {
                return BadRequest(new { msg = "Ngày sinh không đúng!" });
            }
            if (data.Password != account.Password)
            {
                if (!ValidInput.IsPasswordSecure((string?)data.Password))
                    return base.BadRequest(new { msg = "Mật khẩu cần có ít nhất 12 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt." });
                account.Password = HashString.ToHashString(data.Password);
            }

            account.Email = data.Email;
            existingTourGuideByPhone.FullName = data.FullName;
            existingTourGuideByPhone.Phone = data.Phone;
            existingTourGuideByPhone.DateOfBirth = data.DateOfBirth;
            existingTourGuideByPhone.Gender = data.Gender;


            var updateTourGuide = await _tourguideService.UpdateTourGuide(existingTourGuideByPhone);
            var updateAccount = await _accountService.UpdateAccount(account);
            if (updateTourGuide == true && updateAccount == true)
            {
                return Ok();
            }
            return BadRequest();
        }
        [HttpPut("update-from-client")]
        public async Task<IActionResult> UpdateFromClient(TourGuideUpdateModel data)
        {
            var tourGuide = data.Convert();
            var errorList = new List<string>();
            if (!ValidInput.IsPhoneFormatted(data.Phone.Trim()))
                errorList.Add("Số điện thoại không đúng định dạng");
            var existingPhone = await _tourguideService.GetTourGuideByPhone(data.Phone);
            if (existingPhone != null && existingPhone.TourGuideId != tourGuide.TourGuideId)
                errorList.Add("Số điện thoại đã được sử dụng!");
            if (data.DateOfBirth >= DateOnly.FromDateTime(DateTime.Now))
            {
                errorList.Add("Ngày sinh không đúng!");
            }
            if (errorList.Count > 0)
            {
                return BadRequest(new { msg = errorList });
            }
            var updateTourGuide = await _tourguideService.UpdateTourGuideClient(tourGuide);
            if (updateTourGuide)
            {
                return Ok();
            }
            return BadRequest(new { msg = "Cập nhật thất bại" });
        }
        [HttpPut("change-picture/{id}")]
        public async Task<IActionResult> ChangePicture(int id, string fieldToChange, [FromBody] string newValue)
        {
            var update = await _tourguideService.ChangePicture(id, fieldToChange, newValue);
            return update ? Ok() : BadRequest();
        }
        [HttpPut("change-password/{id}")]
        public async Task<IActionResult> ChangePassword(int id, [FromBody] string password)
        {
            if (!ValidInput.IsPasswordSecure(password))
                return base.BadRequest(new { msg = "Mật khẩu cần có ít nhất 12 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt." });
            var update = await _tourguideService.ChangePassword(id, HashString.ToHashString(password));
            return update ? Ok() : BadRequest();
        }
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _tourguideService.DeleteTourGuide(id);
            return result ? NoContent() : NotFound();
        }

        [HttpGet("other")]
        public async Task<IActionResult> GetOtherTourGuide([FromQuery] int tourGuideId, [FromQuery] int pageSize)
        {
            try
            {
                var result = await _tourguideService.GetOtherTourGuidesAsync(tourGuideId, pageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong", error = ex.Message });
            }
        }

        [HttpGet("getbyarea")]
        public async Task<IActionResult> GetTourGuidesByArea([FromQuery] int areaId, [FromQuery] int pageSize)
        {
            try
            {
                var result = await _tourguideService.GetTourGuidesByAreaAsync(areaId, pageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong", error = ex.Message });
            }
        }

    }
}