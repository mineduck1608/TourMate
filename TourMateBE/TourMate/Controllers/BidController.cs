using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.DTO.UpdateModels;
using Repositories.Models;
using Repositories.ResponseModels;
using Services.IServices;
using Services.Utils;

namespace API.Controllers
{
    [Route("api/bids")]
    [ApiController]
    public class BidController : ControllerBase
    {
        private readonly IBidService _bidService;
        private readonly IEmailSender _emailSender;
        private readonly IActiveAreaService _activeAreaService;
        private readonly ITourGuideService _tourGuideService;
        private readonly ICustomerService _customerService;

        public BidController(IBidService bidService, ITourGuideService tourGuideService, IEmailSender emailSender, IActiveAreaService activeAreaService, ICustomerService customerService)
        {
            _bidService = bidService;
            _tourGuideService = tourGuideService;
            _emailSender = emailSender;
            _activeAreaService = activeAreaService;
            _customerService = customerService;
        }

        [HttpGet("{id}")]
        public ActionResult<Bid> Get(int id)
        {
            return Ok(_bidService.GetBid(id));
        }

        [HttpGet]
        public ActionResult<IEnumerable<Bid>> GetAll([FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            return Ok(_bidService.GetAll(pageSize, pageIndex));
        }

        [Authorize(Roles = "TourGuide")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] BidCreateModel data)
        {
            var bid = data.Convert();
            var result = await _bidService.CreateBid(bid);
            return result ? CreatedAtAction(nameof(Get), new { id = bid.BidId }, bid) : BadRequest();
        }

        [HttpPost("send-mail-from-location")]
        public async Task<IActionResult> SendEmailFromLocation([FromQuery] int areaId, [FromQuery] int accId)
        {
            // Lấy danh sách hướng dẫn viên trong khu vực
            var tourGuides = await _tourGuideService.GetTourGuidesByAreaId(areaId);

            // Lấy thông tin khu vực và khách hàng
            var area = await _activeAreaService.GetActiveArea(areaId);
            var customer = await _customerService.GetCustomerByAccId(accId);

            // Kiểm tra null
            if (area == null || customer == null || tourGuides == null || !tourGuides.Any())
            {
                return NotFound(new { message = "Dữ liệu không hợp lệ hoặc không tìm thấy tour guides." });
            }

            // Tạo nội dung email
            var mailBody = _bidService.GenerateBidNotificationEmail(area.AreaName, customer.FullName);

            // Gửi mail cho từng tour guide
            foreach (var guide in tourGuides)
            {
                await _emailSender.SendEmailAsync(
                    guide.Account.Email,
                    "Yêu cầu tìm kiếm mới từ khách hàng",
                    mailBody
                );
            }

            return Ok(new { message = "Emails sent successfully to tour guides." });
        }


        [Authorize(Roles = "TourGuide")]
        [HttpPut]
        public async Task<IActionResult> UpdateAsync([FromBody] BidUpdateModel bid)
        {
            var result = await _bidService.UpdateBid(bid.Convert());
            return result ? NoContent() : BadRequest();
        }

        [Authorize(Roles = "TourGuide")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var result = await _bidService.DeleteBid(id);
            return result ? NoContent() : NotFound();
        }
        [HttpGet("tour/{tourBid}")]
        public async Task<ActionResult<PagedResult<BidListResult>>> GetBidsOfTourBid(int tourBid, [FromQuery] int pageSize = 10, [FromQuery] int pageIndex = 1)
        {
            var result = await _bidService.GetBidsOfTourBid(tourBid, pageSize, pageIndex);
            return Ok(result);
        }

        [Authorize(Roles = "Customer")]
        [HttpPost("accept/{bidId}")]
        public async Task<IActionResult> AcceptBid(int bidId)
        {
            var result = await _bidService.AcceptBid(bidId);
            return result ? NoContent() : NotFound();
        }
    }
}