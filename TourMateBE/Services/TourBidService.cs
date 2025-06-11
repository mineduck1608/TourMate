using Microsoft.Identity.Client;
using Repositories.DTO;
using Repositories.DTO.ResultModels;
using Repositories.Models;
using Repositories.Repository;
using System.Threading.Tasks;

namespace Services
{
    public interface ITourBidService
    {
        Task<TourBid> GetTourBid(int id);
        Task<PagedResult<TourBid>> GetBidsOf(int accountId, int pageSize, int pageIndex);
        Task<bool> CreateTourBid(TourBid tourbid);
        Task<bool> UpdateTourBid(TourBid tourbid);
        Task<bool> DeleteTourBid(int id);
        Task<PagedResult<TourBidListResult>> GetBids(string content, int accountIdFrom, int pageSize, int pageIndex);
        Task<bool> LikeOrUnlikeBid(int accountId, int tourBidId);
    }

    public class TourBidService : ITourBidService
    {
        private TourBidRepository TourBidRepository { get; set; } = new();

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