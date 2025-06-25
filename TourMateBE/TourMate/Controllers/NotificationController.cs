using DocumentFormat.OpenXml.Office2016.Drawing.ChartDrawing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Repositories.Models;
using Repositories.RequestModels;
using Services.IServices;
using TourMate.SignalRHub;

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
}
