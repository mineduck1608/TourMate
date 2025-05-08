using Repositories.DTO;
using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface IActiveAreaService
    {
        ActiveArea GetActiveArea(int id);
        Task<PagedResult<ActiveArea>> GetAll(int pageSize, int pageIndex);
        Task<bool> CreateActiveArea(ActiveArea activearea);
        Task<bool> UpdateActiveArea(ActiveArea activearea);
        bool DeleteActiveArea(int id);
    }

    public class ActiveAreaService : IActiveAreaService
    {
        private ActiveAreaRepository ActiveAreaRepository { get; set; } = new();

        public ActiveArea GetActiveArea(int id)
        {
            return ActiveAreaRepository.GetById(id);
        }

        public async Task<PagedResult<ActiveArea>> GetAll(int pageSize, int pageIndex)
        {
            return await  ActiveAreaRepository.GetAllPaged(pageSize, pageIndex);
        }

        public async Task<bool> CreateActiveArea(ActiveArea activearea)
        {
            return await ActiveAreaRepository.CreateAsync(activearea);
        }


        public async Task<bool> UpdateActiveArea(ActiveArea activearea)
        {
            return await ActiveAreaRepository.UpdateAsync(activearea);
        }

        public bool DeleteActiveArea(int id)
        {
            ActiveAreaRepository.Remove(id);
            return true;
        }
    }
}