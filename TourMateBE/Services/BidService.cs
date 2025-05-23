using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface IBidService
    {
        Bid GetBid(int id);
        IEnumerable<Bid> GetAll(int pageSize, int pageIndex);
        void CreateBid(Bid bid);
        void UpdateBid(Bid bid);
        bool DeleteBid(int id);
    }

    public class BidService : IBidService
    {
        private BidRepository BidRepository { get; set; } = new();

        public Bid GetBid(int id)
        {
            return BidRepository.GetById(id);
        }

        public IEnumerable<Bid> GetAll(int pageSize, int pageIndex)
        {
            return BidRepository.GetAll(pageSize, pageIndex);
        }

        public void CreateBid(Bid bid)
        {
            BidRepository.Create(bid);
        }

        public void UpdateBid(Bid bid)
        {
            BidRepository.Update(bid);
        }

        public bool DeleteBid(int id)
        {
            BidRepository.Remove(id);
            return true;
        }
    }
}