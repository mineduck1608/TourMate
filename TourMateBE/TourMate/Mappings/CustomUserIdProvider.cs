using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace TourMate.Mappings
{
    public class CustomUserIdProvider : IUserIdProvider
    {
        public string? GetUserId(HubConnectionContext connection)
        {
            // Lấy userId từ claim "AccountId"
            return connection.User?.FindFirst("AccountId")?.Value;
        }
    }
}
