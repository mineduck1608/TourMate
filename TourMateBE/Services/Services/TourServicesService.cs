using Repositories.Models;
using Repositories.IRepositories;
using Repositories.ResponseModels;
using Services.IServices;

namespace Services.Services
{
    public class TourServicesService : ITourServicesService
    {
        private ITourServicesRepository TourServicesRepository;

        public TourServicesService(ITourServicesRepository tourServicesRepository)
        {
            TourServicesRepository = tourServicesRepository ?? throw new ArgumentNullException(nameof(tourServicesRepository));
        }

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

        public async Task<bool> UpdateTourServices(TourService tourservices)
        {
            return await TourServicesRepository.UpdateAsync(tourservices);
        }

        public async Task<bool> DeleteTourServices(int id)
        {
            return await TourServicesRepository.RemoveAsync(id);
        }

        public async Task<PagedResult<TourService>> GetTourServicesOf(int tourGuideId, int pageSize, int pageIndex)
        {
            return await TourServicesRepository.GetTourServicesOf(tourGuideId, pageSize, pageIndex);
        }

        public async Task<List<TourService>> GetOtherTourServicesAsync(int tourGuideId, int serviceId, int pageSize)
        {
            return await TourServicesRepository.GetOtherTourServicesAsync(tourGuideId, serviceId, pageSize);
        }
    }
}