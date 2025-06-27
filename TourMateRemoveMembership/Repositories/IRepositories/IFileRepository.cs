using Repositories.GenericRepository;
using Repositories.Models;

namespace Repositories.IRepositories
{
    public interface IFileRepository : IGenericRepository<FileStorage>
    {
        Task<FileStorage?> GetFileOfMessageAsync(int messageId);
    }
}
