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
        TourGuide GetTourGuide(int id);
        IEnumerable<TourGuide> GetAll(int pageSize, int pageIndex);
        bool DeleteTourGuide(int id);
        Task<bool> CreateTourGuide(TourGuide tourguide);
        Task<bool> UpdateTourGuide(TourGuide tourguide);
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
        public TourGuide GetTourGuide(int id)
        {
            return _repository.GetById(id);
        }

        public IEnumerable<TourGuide> GetAll(int pageSize, int pageIndex)
        {
            return _repository.GetAll(pageSize, pageIndex);
        }

        public async Task<PagedResult<TourGuide>> GetAll(int pageSize, int pageIndex, string email, string phone)
        {
            return await _repository.FilterByEmailAndPhone(pageSize, pageIndex, email, phone);
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
    }
}
