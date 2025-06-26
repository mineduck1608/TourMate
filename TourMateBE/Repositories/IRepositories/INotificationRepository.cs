using Repositories.Models;

namespace Repositories.IRepositories
{
    public interface INotificationRepository
    {
        Task AddAsync(Notification notification);
        Task<List<Notification>> GetByReceiverAsync(int receiverId, int page = 1, int pageSize = 10);
        Task<Notification?> GetByIdAsync(int notificationId);
        Task<int> GetUnreadCountAsync(int receiverId);
        Task<int> GetTotalCountAsync(int receiverId);
        Task MarkAsReadAsync(int notificationId);
        Task MarkAllAsReadAsync(int receiverId);
        Task DeleteAsync(int notificationId);
        Task SaveChangesAsync();
    }
}
