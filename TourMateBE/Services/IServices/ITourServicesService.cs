using Repositories.Models;
using Repositories.ResponseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface ITourServicesService
    {
        Task<TourService> GetTourServices(int id);
        Task<PagedResult<TourService>> GetAll(int pageSize, int pageIndex);
        Task CreateTourServices(TourService tourservices);
        Task <bool> UpdateTourServices(TourService tourservices);
        Task<bool> DeleteTourServices(int id);
        Task<PagedResult<TourService>> GetTourServicesOf(int tourGuideId, int pageSize, int pageIndex);
        Task<List<TourService>> GetOtherTourServicesAsync(int tourGuideId, int serviceId, int pageSize);
    }

}
