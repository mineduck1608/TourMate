using Microsoft.AspNetCore.SignalR;

namespace TourMate.MessageHub
{
    public class ChatHub : Hub
    {
        // Phương thức này client sẽ gọi để gửi tin nhắn lên server
        public async Task SendMessage(string user, string message)
        {
            // Server phát tin nhắn tới tất cả client đã kết nối
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
