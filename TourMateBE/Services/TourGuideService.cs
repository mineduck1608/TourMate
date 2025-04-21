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
        void CreateTourGuide(TourGuide tourguide);
        void UpdateTourGuide(TourGuide tourguide);
        bool DeleteTourGuide(int id);
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

        public void CreateTourGuide(TourGuide tourguide)
        {
            _repository.Create(tourguide);
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
