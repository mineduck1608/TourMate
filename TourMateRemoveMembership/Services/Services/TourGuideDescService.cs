using Repositories.Models;
using Repositories.IRepositories;
using Services.IServices;

namespace Services.Services
{
    public class TourGuideDescService : ITourGuideDescService
    {
        private ITourGuideDescRepository TourGuideDescRepository;

        public TourGuideDescService(ITourGuideDescRepository tourGuideDescRepository)
        {
            TourGuideDescRepository = tourGuideDescRepository ?? throw new ArgumentNullException(nameof(tourGuideDescRepository));
        }

        public TourGuideDesc GetTourGuideDesc(int id)
        {
            return TourGuideDescRepository.GetById(id);
        }

        public IEnumerable<TourGuideDesc> GetAll(int pageSize, int pageIndex)
        {
            return TourGuideDescRepository.GetAll(pageSize, pageIndex);
        }

        public async Task<bool> CreateTourGuideDesc(TourGuideDesc tourguidedesc)
        {
            return await TourGuideDescRepository.CreateAsync(tourguidedesc);
        }

        public void UpdateTourGuideDesc(TourGuideDesc tourguidedesc)
        {
            TourGuideDescRepository.Update(tourguidedesc);
        }

        public bool DeleteTourGuideDesc(int id)
        {
            TourGuideDescRepository.Remove(id);
            return true;
        }
    }
}