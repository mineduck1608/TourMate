using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface ITourGuideDescService
    {
        TourGuideDesc GetTourGuideDesc(int id);
        IEnumerable<TourGuideDesc> GetAll(int pageSize, int pageIndex);
        void CreateTourGuideDesc(TourGuideDesc tourguidedesc);
        void UpdateTourGuideDesc(TourGuideDesc tourguidedesc);
        bool DeleteTourGuideDesc(int id);
    }

    public class TourGuideDescService : ITourGuideDescService
    {
        private TourGuideDescRepository TourGuideDescRepository { get; set; } = new();

        public TourGuideDesc GetTourGuideDesc(int id)
        {
            return TourGuideDescRepository.GetById(id);
        }

        public IEnumerable<TourGuideDesc> GetAll(int pageSize, int pageIndex)
        {
            return TourGuideDescRepository.GetAll(pageSize, pageIndex);
        }

        public void CreateTourGuideDesc(TourGuideDesc tourguidedesc)
        {
            TourGuideDescRepository.Create(tourguidedesc);
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