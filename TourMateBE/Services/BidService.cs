using Repositories.DTO.ResultModels;
using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface IBidService
    {
        Bid GetBid(int id);
        IEnumerable<Bid> GetAll(int pageSize, int pageIndex);
        Task<bool> CreateBid(Bid bid);
        Task<bool> UpdateBid(Bid bid);
        Task<bool> DeleteBid(int id);
        Task<PagedResult<BidListResult>> GetBidsOfTourBid(int tourBid, int pageSize, int pageIndex);
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

        public async Task<bool> CreateBid(Bid bid)
        {
            return await BidRepository.CreateAsync(bid);
        }

        public async Task<bool> UpdateBid(Bid bid)
        {
            return await BidRepository.UpdateAsync(bid);
        }

        public async Task<bool> DeleteBid(int id)
        {
            return await BidRepository.RemoveAsync(id);
        }
        public async Task<PagedResult<BidListResult>> GetBidsOfTourBid(int tourBid, int pageSize, int pageIndex)
        {
            return await BidRepository.GetBidsOfTourBid(tourBid, pageSize, pageIndex);
        }
    }
}