using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface ITourGuideRevenueService
    {
        TourGuideRevenue GetTourGuideRevenue(int id);
        IEnumerable<TourGuideRevenue> GetAll(int pageSize, int pageIndex);
        void CreateTourGuideRevenue(TourGuideRevenue tourguiderevenue);
        void UpdateTourGuideRevenue(TourGuideRevenue tourguiderevenue);
        bool DeleteTourGuideRevenue(int id);
    }

    public class TourGuideRevenueService : ITourGuideRevenueService
    {
        private TourGuideRevenueRepository TourGuideRevenueRepository { get; set; } = new();

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