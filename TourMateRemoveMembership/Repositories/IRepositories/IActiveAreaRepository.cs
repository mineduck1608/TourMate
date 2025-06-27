using Repositories.Models;
using Repositories.ResponseModels;
using Repositories.GenericRepository;

namespace Repositories.IRepositories
{
    public interface IActiveAreaRepository : IGenericRepository<ActiveArea>
    {
        Task<PagedResult<ActiveArea>> GetActiveAreas(string search, string region, int page, int limit);
        Task<IEnumerable<SimplifiedAreaListResult>> GetSimplifiedActiveAreas();
        Task<IEnumerable<MostPopularArea>> GetMostPopularAreas();
        Task<List<ActiveArea>> GetRandomActiveAreaAsync(int size);
        Task<List<ActiveArea>> GetOtherActiveAreaAsync(int currentId, int size);
    }
}
