using Repositories.GenericRepository;
using Repositories.Models;
using Repositories.ResponseModels;

namespace Repositories.IRepositories
{
    public interface ITourGuideRepository : IGenericRepository<TourGuide>
    {
        Task<TourGuide> GetTourGuideById(int tourGuideId);
        Task<TourGuideIdAndName> GetTourGuideByAccountIdAsync(int accountId);
        Task<TourGuide> GetByAccId(int accId);
        Task<TourGuide> GetById(int id);
        Task<PagedResult<TourGuide>> GetAllPaged(int pageSize, int pageIndex, bool descending = true);
        Task<PagedResult<TourGuide>> FilterByPhone(int pageSize, int pageIndex, string phone);
        Task<TourGuide> GetByPhone(string phone);
        Task<bool> UpdateProfile(TourGuide tourGuide);
        Task<PagedResult<TourGuide>> GetList(int pageSize, int pageIndex, string? name, int? areaId);
        Task<bool> ChangePicture(int id, string fieldToChange, string newValue);
        Task<bool> ChangePassword(int id, string password);
        Task<List<TourGuide>> GetOtherTourGuidesAsync(int tourGuideId, int pageSize);
        Task<List<TourGuide>> GetTourGuidesByAreaAsync(int areaId, int pageSize);
    }
}
