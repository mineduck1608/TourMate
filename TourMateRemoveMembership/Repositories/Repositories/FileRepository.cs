using Microsoft.EntityFrameworkCore;
using Repositories.Context;
using Repositories.GenericRepository;
using Repositories.IRepositories;
using Repositories.Models;

namespace Repositories.Repositories
{
    public class FileRepository : GenericRepository<FileStorage>, IFileRepository
    {
        public FileRepository(TourmateContext context) : base(context)
        {
        }

        public async Task<FileStorage?> GetFileOfMessageAsync(int messageId)
        {
            var result = await _context.FileStorages
                .Include(f => f.Messages)
                .Where(f => f.Messages.Any(m => m.MessageId == messageId))
                .FirstOrDefaultAsync();

            return result;
        }
    }
}
