using Repositories.DTO;
using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface ITourServicesService
    {
        Task<TourService> GetTourServices(int id);
        Task<PagedResult<TourService>> GetAll(int pageSize, int pageIndex);
        Task CreateTourServices(TourService tourservices);
        Task UpdateTourServices(TourService tourservices);
        Task<bool> DeleteTourServices(int id);
    }

    public class TourServicesService : ITourServicesService
    {
        private TourServicesRepository TourServicesRepository { get; set; } = new();

        public async Task<TourService> GetTourServices(int id)
        {
            return await TourServicesRepository.GetByIdAsync(id);
        }

        public async Task<PagedResult<TourService>> GetAll(int pageSize, int pageIndex)
        {
            return await TourServicesRepository.GetAllPaged(pageSize, pageIndex, "CreatedDate");
        }

        public async Task CreateTourServices(TourService tourservices)
        {
            await TourServicesRepository.CreateAsync(tourservices);
        }

        public async Task UpdateTourServices(TourService tourservices)
        {
            await TourServicesRepository.UpdateAsync(tourservices);
        }

        public async Task<bool> DeleteTourServices(int id)
        {
            return await TourServicesRepository.RemoveAsync(id);
        }
    }
}