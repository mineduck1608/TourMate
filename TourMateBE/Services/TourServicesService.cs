using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface ITourServicesService
    {
        TourService GetTourServices(int id);
        IEnumerable<TourService> GetAll(int pageSize, int pageIndex);
        void CreateTourServices(TourService tourservices);
        void UpdateTourServices(TourService tourservices);
        bool DeleteTourServices(int id);
    }

    public class TourServicesService : ITourServicesService
    {
        private TourServicesRepository TourServicesRepository { get; set; } = new();

        public TourService GetTourServices(int id)
        {
            return TourServicesRepository.GetById(id);
        }

        public IEnumerable<TourService> GetAll(int pageSize, int pageIndex)
        {
            return TourServicesRepository.GetAll(pageSize, pageIndex);
        }

        public void CreateTourServices(TourService tourservices)
        {
            TourServicesRepository.Create(tourservices);
        }

        public void UpdateTourServices(TourService tourservices)
        {
            TourServicesRepository.Update(tourservices);
        }

        public bool DeleteTourServices(int id)
        {
            TourServicesRepository.Remove(id);
            return true;
        }
    }
}