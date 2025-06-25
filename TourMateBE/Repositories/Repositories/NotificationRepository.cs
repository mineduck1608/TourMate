using Microsoft.EntityFrameworkCore;
using Repositories.Context;
using Repositories.IRepositories;
using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

        public async Task<List<Notification>> GetByReceiverAsync(int receiverId)
        {
            return await _context.Notifications
                .Where(n => n.ReceiverAccountId == receiverId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
        }

        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
    }

}
