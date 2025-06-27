using Repositories.GenericRepository;
using Repositories.Models;
using Repositories.ResponseModels;

namespace Repositories.IRepositories
{
    public interface ITourServicesRepository : IGenericRepository<TourService>
    {
        Task<PagedResult<TourService>> GetTourServicesOf(int tourGuideId, int pageSize, int pageIndex);
        Task<List<TourService>> GetOtherTourServicesAsync(int tourGuideId, int serviceId, int pageSize);
        Task<bool> RemoveAsync(int id);
    }
}
