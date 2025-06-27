using Microsoft.Identity.Client;
using Repositories.DTO;
using Repositories.Models;
using Repositories.IRepositories;
using Repositories.ResponseModels;
using System.Threading.Tasks;
using Services.IServices;

namespace Services.Services
{
    public class TourBidService : ITourBidService
    {
        private ITourBidRepository TourBidRepository;

        public TourBidService(ITourBidRepository tourBidRepository)
        {
            TourBidRepository = tourBidRepository ?? throw new ArgumentNullException(nameof(tourBidRepository));
        }

        public async Task<TourBid> GetTourBid(int id)
        {
            return await TourBidRepository.GetByIdAsync(id);
        }

        public async Task<PagedResult<TourBid>> GetBidsOf(int accountId, int pageSize, int pageIndex)
        {
            return await TourBidRepository.GetBidsOf(accountId, pageSize, pageIndex);
        }

        public async Task<bool> CreateTourBid(TourBid tourbid)
        {
            return await TourBidRepository.CreateAsync(tourbid);
        }

        public async Task<bool> UpdateTourBid(TourBid tourbid)
        {
            return await TourBidRepository.UpdateAsync(tourbid);
        }

        public async Task<bool> DeleteTourBid(int id)
        {
            await TourBidRepository.RemoveAsync(id);
            return true;
        }

        public async Task<PagedResult<TourBidListResult>> GetBids(string content, int accountIdFrom, int pageSize, int pageIndex)
        {
            return await TourBidRepository.GetBids(content, accountIdFrom, pageSize, pageIndex);
        }

        public async Task<bool> LikeOrUnlikeBid(int accountId, int tourBidId)
        {
            return await TourBidRepository.LikeOrUnlikeBid(accountId, tourBidId);
        }
    }
}