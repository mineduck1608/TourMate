using Microsoft.AspNetCore.SignalR;

namespace TourMate.SignalRHub
{
    public class NotificationHub : Hub
    {
        // Không cần viết gì thêm nếu chỉ dùng để server push message
        // Nhưng bạn có thể thêm log hoặc tracking nếu muốn

        public override async Task OnConnectedAsync()
        {
            var claims = Context.User?.Claims.ToList();

            Console.WriteLine("📌 Claims on connect:");
            if (claims == null || claims.Count == 0)
            {
                Console.WriteLine("⚠️ No claims found");
            }
            else
            {
                foreach (var claim in claims)
                {
                    Console.WriteLine($"🔎 {claim.Type} = {claim.Value}");
                }
            }

            Console.WriteLine($"✅ User connected: {Context.UserIdentifier}");
            await base.OnConnectedAsync();
        }


        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await base.OnDisconnectedAsync(exception);
            Console.WriteLine($"⚠️ User disconnected: {Context.UserIdentifier}");
        }

        // (Optional) Client có thể gọi lên server nếu muốn
        public Task Echo(string message)
        {
            return Clients.Caller.SendAsync("ReceiveNotification", $"Echo: {message}");
        }
    }
}
