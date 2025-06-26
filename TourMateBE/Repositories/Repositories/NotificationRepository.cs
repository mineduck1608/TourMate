using Microsoft.EntityFrameworkCore;
using Repositories.Context;
using Repositories.IRepositories;
using Repositories.Models;

namespace Repositories.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly TourmateContext _context;

        public NotificationRepository(TourmateContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Notification notification)
        {
            await _context.Notifications.AddAsync(notification);
        }

        public async Task<List<Notification>> GetByReceiverAsync(int receiverId, int page = 1, int pageSize = 10)
        {
            return await _context.Notifications
                .Where(n => n.ReceiverAccountId == receiverId)
                .OrderByDescending(n => n.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<Notification?> GetByIdAsync(int notificationId)
        {
            return await _context.Notifications
                .FirstOrDefaultAsync(n => n.NotificationId == notificationId);
        }

        public async Task<int> GetUnreadCountAsync(int receiverId)
        {
            return await _context.Notifications
                .CountAsync(n => n.ReceiverAccountId == receiverId && !n.IsRead);
        }

        public async Task<int> GetTotalCountAsync(int receiverId)
        {
            return await _context.Notifications
                .CountAsync(n => n.ReceiverAccountId == receiverId);
        }

        public async Task MarkAsReadAsync(int notificationId)
        {
            var notification = await GetByIdAsync(notificationId);
            if (notification != null)
            {
                notification.IsRead = true;
                _context.Notifications.Update(notification);
            }
        }

        public async Task MarkAllAsReadAsync(int receiverId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.ReceiverAccountId == receiverId && !n.IsRead)
                .ToListAsync();

            foreach (var notification in notifications)
            {
                notification.IsRead = true;
            }

            _context.Notifications.UpdateRange(notifications);
        }

        public async Task DeleteAsync(int notificationId)
        {
            var notification = await GetByIdAsync(notificationId);
            if (notification != null)
            {
                _context.Notifications.Remove(notification);
            }
        }

        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
    }
}
