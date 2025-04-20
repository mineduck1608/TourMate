using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface ITourBidService
    {
        TourBid GetTourBid(int id);
        IEnumerable<TourBid> GetAll(int pageSize, int pageIndex);
        void CreateTourBid(TourBid tourbid);
        void UpdateTourBid(TourBid tourbid);
        bool DeleteTourBid(int id);
    }

    public class TourBidService : ITourBidService
    {
        private TourBidRepository TourBidRepository { get; set; } = new();

        public TourBid GetTourBid(int id)
        {
            return TourBidRepository.GetById(id);
        }

        public IEnumerable<TourBid> GetAll(int pageSize, int pageIndex)
        {
            return TourBidRepository.GetAll(pageSize, pageIndex);
        }

        public void CreateTourBid(TourBid tourbid)
        {
            TourBidRepository.Create(tourbid);
        }

        public void UpdateTourBid(TourBid tourbid)
        {
            TourBidRepository.Update(tourbid);
        }

        public bool DeleteTourBid(int id)
        {
            TourBidRepository.Remove(id);
            return true;
        }
    }
}