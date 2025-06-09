using Repositories.DTO.ResultModels;
using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface IActiveAreaService
    {
        ActiveArea GetActiveArea(int id);
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

    public class ActiveAreaService : IActiveAreaService
    {
        private ActiveAreaRepository ActiveAreaRepository { get; set; } = new();

        public async Task<List<AreaIdAndName>> GetActiveAreasAsync()
        {
            var areas = await ActiveAreaRepository.GetAllList();

            return areas.Select(a => new AreaIdAndName
            {
                AreaId = a.AreaId,
                AreaName = a.AreaName
            }).ToList();
        }

        public ActiveArea GetActiveArea(int id)
        {
            return ActiveAreaRepository.GetById(id);
        }

        public async Task<PagedResult<ActiveArea>> GetAll(int pageSize, int pageIndex)
        {
            return await  ActiveAreaRepository.GetAllPaged(pageSize, pageIndex);
        }

        // L?y các ActiveAreas v?i b? l?c và phân trang
        public async Task<PagedResult<ActiveArea>> GetActiveAreas(string search, string region, int page, int limit)
        {
            return await ActiveAreaRepository.GetActiveAreas(search, region, page, limit);
        }


        public async Task<bool> CreateActiveArea(ActiveArea activearea)
        {
            return await ActiveAreaRepository.CreateAsync(activearea);
        }


        public async Task<bool> UpdateActiveArea(ActiveArea activearea)
        {
            return await ActiveAreaRepository.UpdateAsync(activearea);
        }

        public async Task<bool> DeleteActiveArea(int id)
        {
            await ActiveAreaRepository.RemoveAsync(id);
            return true;
        }
        public async Task<IEnumerable<SimplifiedAreaListResult>> GetSimplifiedAreas()
        {
            return await ActiveAreaRepository.GetSimplifiedActiveAreas();
        }

        public async Task<List<ActiveArea>> GetRandomActiveAreaAsync(int size)
        {
            return await ActiveAreaRepository.GetRandomActiveAreaAsync(size);
        }

        public async Task<List<ActiveArea>> GetOtherActiveAreaAsync(int currentId, int size)
        {
            return await ActiveAreaRepository.GetOtherActiveAreaAsync(currentId, size);
        }

        public async Task<IEnumerable<MostPopularArea>> GetMostPopularAreas()
        {
            return await ActiveAreaRepository.GetMostPopularAreas();
        }
    }
}