using Microsoft.AspNetCore.SignalR;

namespace TourMate.NotificationHub
{
    public class NotificationHub : Hub
    {
        public async Task SubscribeToAreaId(int areaId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, areaId.ToString());
        }
    }
}
