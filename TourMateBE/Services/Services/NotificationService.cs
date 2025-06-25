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

        public async Task SaveNotificationsAsync(List<Notification> notifications)
        {
            foreach (var noti in notifications)
            {
                await _repo.AddAsync(noti);
            }
            await _repo.SaveChangesAsync();
        }
    }


}
