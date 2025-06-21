using Repositories.Models;
using Repositories.IRepositories;
using Services.IServices;

namespace Services.Services
{
    public class TourGuideRevenueService : ITourGuideRevenueService
    {
        private ITourGuideRevenueRepository TourGuideRevenueRepository;

        public TourGuideRevenueService(ITourGuideRevenueRepository tourGuideRevenueRepository)
        {
            TourGuideRevenueRepository = tourGuideRevenueRepository ?? throw new ArgumentNullException(nameof(tourGuideRevenueRepository));
        }

        public TourGuideRevenue GetTourGuideRevenue(int id)
        {
            return TourGuideRevenueRepository.GetById(id);
        }

        public IEnumerable<TourGuideRevenue> GetAll(int pageSize, int pageIndex)
        {
            return TourGuideRevenueRepository.GetAll(pageSize, pageIndex);
        }

        public void CreateTourGuideRevenue(TourGuideRevenue tourguiderevenue)
        {
            TourGuideRevenueRepository.Create(tourguiderevenue);
        }

        public void UpdateTourGuideRevenue(TourGuideRevenue tourguiderevenue)
        {
            TourGuideRevenueRepository.Update(tourguiderevenue);
        }

        public bool DeleteTourGuideRevenue(int id)
        {
            TourGuideRevenueRepository.Remove(id);
            return true;
        }
    }
}