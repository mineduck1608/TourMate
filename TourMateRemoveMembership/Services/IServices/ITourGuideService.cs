using Repositories.Models;
using Repositories.ResponseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface ITourGuideService
    {
        Task<TourGuide> GetTourGuideByAccId(int accId);
        Task<TourGuide> GetTourGuide(int id);
        Task<List<TourGuide>> GetTourGuidesByAreaId(int areaId);
        Task<PagedResult<TourGuide>> GetAll(int pageSize, int pageIndex, string phone);
        bool DeleteTourGuide(int id);
        Task<bool> CreateTourGuide(TourGuide tourguide);
        Task<bool> UpdateTourGuide(TourGuide tourguide);
        Task<TourGuide> GetTourGuideByPhone(string phone);
        Task<bool> UpdateTourGuideClient(TourGuide tourGuide);
        Task<PagedResult<TourGuide>> GetList(int pageSize, int pageIndex, string? name, int? areaId);
        Task<bool> ChangePicture(int id, string fieldToChange, string newValue);
        Task<List<TourGuide>> GetOtherTourGuidesAsync(int tourGuideId, int pageSize);
        Task<bool> ChangePassword(int id, string password);
        Task<List<TourGuide>> GetTourGuidesByAreaAsync(int areaId, int pageSize);
        Task<TourGuideIdAndName> GetTourGuideByAccountIdAsync(int accountId);
    }
}
