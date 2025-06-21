using Repositories.GenericRepository;
using Repositories.Models;
using Repositories.ResponseModels;

namespace Repositories.IRepositories
{
    public interface INewsRepository : IGenericRepository<News>
    {
        Task<PagedResult<News>> FilterByCategory(int pageSize, int pageIndex, string category);
        Task<List<News>> GetRecentNews(int excludeId, int count);
    }
}
