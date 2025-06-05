using Microsoft.Identity.Client;
using Repositories.DTO;
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
        Task<PagedResult<TourBid>> GetBids(string content, int pageSize, int pageIndex);
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

        public async Task<PagedResult<TourBid>> GetBids(string content, int pageSize, int pageIndex)
        {
            return await TourBidRepository.GetBids(content, pageSize, pageIndex);
        }
    }
}