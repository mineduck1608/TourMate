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
        Task<TourGuide> GetTourGuideAsync(int id);
        Task<PagedResult<TourGuide>> GetAllAsync(int pageSize, int pageIndex);
        void UpdateTourGuide(TourGuide tourguide);
        bool DeleteTourGuide(int id);
        Task<bool> CreateTourGuide(TourGuide tourGuide);
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
        public async Task<TourGuide> GetTourGuideAsync(int id)
        {
            return await _repository.GetById(id);
        }

        public async Task<PagedResult<TourGuide>> GetAllAsync(int pageSize, int pageIndex)
        {
            return await _repository.GetAllPaged(pageSize, pageIndex);
        }

        public async Task<bool> CreateTourGuide(TourGuide tourGuide)
        {
            return await _repository.CreateAsync(tourGuide);
        }

        public void UpdateTourGuide(TourGuide tourguide)
        {
            _repository.Update(tourguide);
        }

        public bool DeleteTourGuide(int id)
        {
            _repository.Remove(id);
            return true;
        }
    }
}
