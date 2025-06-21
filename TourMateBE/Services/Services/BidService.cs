using Repositories.Models;
using Repositories.IRepositories;
using Repositories.ResponseModels;
using Services.IServices;

namespace Services.Services
{
    public class BidService : IBidService
    {
        private IBidRepository BidRepository;

        public BidService(IBidRepository bidRepository)
        {
            BidRepository = bidRepository ?? throw new ArgumentNullException(nameof(bidRepository));
        }

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
        public async Task<bool> AcceptBid(int bidId)
        {
            return await BidRepository.AcceptBid(bidId);
        }
    }
}