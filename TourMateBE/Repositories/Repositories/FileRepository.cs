using Microsoft.EntityFrameworkCore;
using Repositories.GenericRepository;
using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Repositories
{
    public class FileRepository : GenericRepository<FileStorage>
    {
        public async Task<FileStorage> GetFileOfMessageAsync(int messageId)
        {
            var rs = await _context.FileStorages
                .Include(f => f.Messages)
                .Where(f => f.Messages.Any(m => m.MessageId == messageId))
                .FirstOrDefaultAsync();
            return rs;
        }
    }
}
