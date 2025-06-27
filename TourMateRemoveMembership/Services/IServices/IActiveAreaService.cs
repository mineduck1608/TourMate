using Repositories.Models;
using Repositories.ResponseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface IActiveAreaService
    {
        Task<ActiveArea> GetActiveArea(int id);
        Task<PagedResult<ActiveArea>> GetAll(int pageSize, int pageIndex);
        Task<PagedResult<ActiveArea>> GetActiveAreas(string search, string region, int page, int limit);

        Task<bool> CreateActiveArea(ActiveArea activearea);
        Task<bool> UpdateActiveArea(ActiveArea activearea);
        Task<bool> DeleteActiveArea(int id);
        Task<IEnumerable<SimplifiedAreaListResult>> GetSimplifiedAreas();
        Task<IEnumerable<MostPopularArea>> GetMostPopularAreas();
        Task<List<ActiveArea>> GetRandomActiveAreaAsync(int size);
        Task<List<ActiveArea>> GetOtherActiveAreaAsync(int currentId, int size);
        Task<List<AreaIdAndName>> GetActiveAreasAsync();
    }
}
