using Repositories.Models;

namespace Services.IServices
{
    public interface INotificationService
    {
        // Existing method - keep as is
        Task SaveNotificationsAsync(List<Notification> notifications);

        // New methods for complete notification system
        Task<List<Notification>> GetNotificationsByReceiverAsync(int receiverId, int page = 1, int pageSize = 10);
        Task<Notification?> GetNotificationByIdAsync(int notificationId);
        Task<int> GetUnreadCountAsync(int receiverId);
        Task<int> GetTotalCountAsync(int receiverId);
        Task MarkAsReadAsync(int notificationId);
        Task MarkAllAsReadAsync(int receiverId);
        Task DeleteNotificationAsync(int notificationId);
        Task<bool> CanUserAccessNotificationAsync(int notificationId, int userId);
    }
}
