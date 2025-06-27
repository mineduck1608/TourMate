using Repositories.Context;
using Repositories.IRepositories;
using Repositories.Models;
using Services.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _repo;

        public NotificationService(INotificationRepository repo)
        {
            _repo = repo;
        }

        // Existing method - keep exactly as is
        public async Task SaveNotificationsAsync(List<Notification> notifications)
        {
            foreach (var noti in notifications)
            {
                await _repo.AddAsync(noti);
            }
            await _repo.SaveChangesAsync();
        }

        // New methods for complete notification system
        public async Task<List<Notification>> GetNotificationsByReceiverAsync(int receiverId, int page = 1, int pageSize = 10)
        {
            return await _repo.GetByReceiverAsync(receiverId, page, pageSize);
        }

        public async Task<Notification?> GetNotificationByIdAsync(int notificationId)
        {
            return await _repo.GetByIdAsync(notificationId);
        }

        public async Task<int> GetUnreadCountAsync(int receiverId)
        {
            return await _repo.GetUnreadCountAsync(receiverId);
        }

        public async Task<int> GetTotalCountAsync(int receiverId)
        {
            return await _repo.GetTotalCountAsync(receiverId);
        }

        public async Task MarkAsReadAsync(int notificationId)
        {
            await _repo.MarkAsReadAsync(notificationId);
            await _repo.SaveChangesAsync();
        }

        public async Task MarkAllAsReadAsync(int receiverId)
        {
            await _repo.MarkAllAsReadAsync(receiverId);
            await _repo.SaveChangesAsync();
        }

        public async Task DeleteNotificationAsync(int notificationId)
        {
            await _repo.DeleteAsync(notificationId);
            await _repo.SaveChangesAsync();
        }

        public async Task<bool> CanUserAccessNotificationAsync(int notificationId, int userId)
        {
            var notification = await _repo.GetByIdAsync(notificationId);
            return notification != null && notification.ReceiverAccountId == userId;
        }
    }
}
