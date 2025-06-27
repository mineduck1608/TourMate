using DocumentFormat.OpenXml.Office2016.Drawing.ChartDrawing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Repositories.Models;
using Repositories.RequestModels;
using Services.IServices;
using TourMate.SignalRHub;
using System.Security.Claims;

[Authorize]
[Route("api/notifications")]
[ApiController]
public class NotificationController : ControllerBase
{
    private readonly ITourGuideService _tourGuideService;
    private readonly IActiveAreaService _activeAreaService;
    private readonly ICustomerService _customerService;
    private readonly INotificationService _notificationService;
    private readonly IHubContext<NotificationHub> _hubContext;

    public NotificationController(
        ITourGuideService tourGuideService,
        IActiveAreaService activeAreaService,
        ICustomerService customerService,
        INotificationService notificationService,
        IHubContext<NotificationHub> hubContext)
    {
        _tourGuideService = tourGuideService;
        _activeAreaService = activeAreaService;
        _customerService = customerService;
        _notificationService = notificationService;
        _hubContext = hubContext;
    }

    // Existing method - keep exactly as is
    [HttpPost("tour-bid")]
    public async Task<IActionResult> NotifyTourBid([FromBody] NotificationTourBid dto)
    {
        var guides = await _tourGuideService.GetTourGuidesByAreaId(dto.AreaId);
        var area = await _activeAreaService.GetActiveArea(dto.AreaId);
        var customer = await _customerService.GetCustomerByAccId(dto.AccId);

        var message = $"🧳 Có TourBid mới cần hướng dẫn viên tại địa điểm <strong>{area.AreaName}</strong> từ khách hàng <strong>{customer.FullName}</strong>";
        var link = "/tour-guide/bids";

        var notifications = new List<Notification>();

        foreach (var guide in guides)
        {
            if (guide.AccountId == dto.AccId) continue;

            await _hubContext.Clients.User(guide.AccountId.ToString())
                .SendAsync("ReceiveNotification", new
                {
                    message,
                    link,
                    createdAt = DateTime.UtcNow
                });

            notifications.Add(new Notification
            {
                ReceiverAccountId = guide.AccountId,
                Message = message,
                Link = link,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            });
        }

        await _notificationService.SaveNotificationsAsync(notifications);

        return Ok();
    }

    // New methods for complete notification system
    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst("AccountId")?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : 0;
    }

    [HttpGet]
    public async Task<IActionResult> GetNotifications([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == 0)
                return Unauthorized("Invalid user token");

            var notifications = await _notificationService.GetNotificationsByReceiverAsync(userId, page, pageSize);
            var totalCount = await _notificationService.GetTotalCountAsync(userId);
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            var response = new
            {
                notifications = notifications.Select(n => new
                {
                    id = n.NotificationId.ToString(),
                    message = n.Message,
                    link = n.Link ?? "",
                    createdAt = n.CreatedAt?.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                    isRead = n.IsRead
                }).ToList(),
                hasMore = page < totalPages,
                totalCount = totalCount
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Lỗi server", error = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetNotification(int id)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == 0)
                return Unauthorized("Invalid user token");

            var notification = await _notificationService.GetNotificationByIdAsync(id);
            if (notification == null)
                return NotFound("Không tìm thấy thông báo");

            if (!await _notificationService.CanUserAccessNotificationAsync(id, userId))
                return Forbid("Không có quyền truy cập thông báo này");

            var response = new
            {
                notificationId = notification.NotificationId,
                receiverAccountId = notification.ReceiverAccountId,
                message = notification.Message,
                link = notification.Link,
                isRead = notification.IsRead,
                createdAt = notification.CreatedAt
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Lỗi server", error = ex.Message });
        }
    }

    [HttpPut("{id}/mark-read")]
    public async Task<IActionResult> MarkAsRead(string id)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == 0)
                return Unauthorized("Invalid user token");

            if (!int.TryParse(id, out var notificationId))
                return BadRequest("Invalid notification ID");

            if (!await _notificationService.CanUserAccessNotificationAsync(notificationId, userId))
                return Forbid("Không có quyền truy cập thông báo này");

            await _notificationService.MarkAsReadAsync(notificationId);
            return Ok(new { message = "Đã đánh dấu thông báo đã đọc" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Lỗi server", error = ex.Message });
        }
    }

    [HttpPut("mark-all-read")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == 0)
                return Unauthorized("Invalid user token");

            await _notificationService.MarkAllAsReadAsync(userId);
            return Ok(new { message = "Đã đánh dấu tất cả thông báo đã đọc" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Lỗi server", error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNotification(string id)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == 0)
                return Unauthorized("Invalid user token");

            if (!int.TryParse(id, out var notificationId))
                return BadRequest("Invalid notification ID");

            if (!await _notificationService.CanUserAccessNotificationAsync(notificationId, userId))
                return Forbid("Không có quyền truy cập thông báo này");

            await _notificationService.DeleteNotificationAsync(notificationId);
            return Ok(new { message = "Đã xóa thông báo" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Lỗi server", error = ex.Message });
        }
    }

    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount()
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == 0)
                return Unauthorized("Invalid user token");

            var count = await _notificationService.GetUnreadCountAsync(userId);
            return Ok(count);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Lỗi server", error = ex.Message });
        }
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == 0)
                return Unauthorized("Invalid user token");

            var total = await _notificationService.GetTotalCountAsync(userId);
            var unread = await _notificationService.GetUnreadCountAsync(userId);
            var read = total - unread;

            // Get today's notifications
            var todayNotifications = await _notificationService.GetNotificationsByReceiverAsync(userId, 1, 1000);
            var today = todayNotifications.Count(n => n.CreatedAt == DateTime.Today);

            var stats = new
            {
                total = total,
                unread = unread,
                read = read,
                today = today
            };

            return Ok(stats);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Lỗi server", error = ex.Message });
        }
    }
}
