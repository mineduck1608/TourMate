using Repositories.DTO;
using Repositories.Models;
using Repositories.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public interface ITourGuideService
    {
        Task<TourGuide> GetTourGuideByAccId(int accId);
        Task<TourGuide> GetTourGuide(int id);
        Task<PagedResult<TourGuide>> GetAll(int pageSize, int pageIndex, string phone);
        bool DeleteTourGuide(int id);
        Task<bool> CreateTourGuide(TourGuide tourguide);
        Task<bool> UpdateTourGuide(TourGuide tourguide);
        Task<TourGuide> GetTourGuideByPhone(string phone);
        Task<bool> UpdateTourGuideClient(TourGuide tourGuide);
    }
    public class TourGuideService : ITourGuideService
    {
        private readonly TourGuideRepository _repository;

        public TourGuideService(TourGuideRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
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
    }
}
