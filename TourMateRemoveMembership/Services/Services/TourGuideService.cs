using Repositories.Models;
using Repositories.IRepositories;
using Repositories.ResponseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Services.IServices;

namespace Services.Services
{
    public class TourGuideService : ITourGuideService
    {
        private readonly ITourGuideRepository _repository;

        public TourGuideService(ITourGuideRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        public async Task<TourGuideIdAndName> GetTourGuideByAccountIdAsync(int accountId)
        {
            return await _repository.GetTourGuideByAccountIdAsync(accountId);
        }

        public async Task<List<TourGuide>> GetTourGuidesByAreaId(int areaId)
        {
            return await _repository.GetTourGuidesByArea(areaId);
        }

        public async Task<TourGuide> GetTourGuideByAccId(int accId)
        {
            return await _repository.GetByAccId(accId);
        }
        public async Task<TourGuide> GetTourGuide(int id)
        {
            return await _repository.GetById(id);
        }

        public async Task<PagedResult<TourGuide>> GetAll(int pageSize, int pageIndex)
        {
            return await _repository.GetAllPaged(pageSize, pageIndex);
        }

        public async Task<PagedResult<TourGuide>> GetAll(int pageSize, int pageIndex, string phone)
        {
            return await _repository.FilterByPhone(pageSize, pageIndex, phone);
        }

        public async Task<bool> CreateTourGuide(TourGuide tourguide)
        {
            return await _repository.CreateAsync(tourguide);
        }

        public async Task<bool> UpdateTourGuide(TourGuide tourguide)
        {
            return await _repository.UpdateAsync(tourguide);
        }

        public bool DeleteTourGuide(int id)
        {
            _repository.Remove(id);
            return true;
        }

        public async Task<TourGuide> GetTourGuideByPhone(string phone)
        {
            return await _repository.GetByPhone(phone);
        }

        public async Task<bool> UpdateTourGuideClient(TourGuide tourGuide)
        {
            return await _repository.UpdateProfile(tourGuide);
        }

        public async Task<PagedResult<TourGuide>> GetList(int pageSize, int pageIndex, string? name, int? areaId)
        {
            return await _repository.GetList(pageSize, pageIndex, name, areaId);
        }

        public async Task<bool> ChangePicture(int id, string fieldToChange, string newValue)
        {
            return await _repository.ChangePicture(id, fieldToChange, newValue);
        }
        public async Task<bool> ChangePassword(int id, string password)
        {
            return await _repository.ChangePassword(id, password);
        }
        public async Task<List<TourGuide>> GetTourGuidesByAreaAsync(int areaId, int pageSize)
        {
            return await _repository.GetTourGuidesByAreaAsync(areaId, pageSize);
        }

        public async Task<List<TourGuide>> GetOtherTourGuidesAsync(int tourGuideId, int pageSize)
        {
            return await _repository.GetOtherTourGuidesFavorMembership(tourGuideId, pageSize);
        }
    }
}
