using Repositories.DTO;
using Repositories.GenericRepository;
using Repositories.Models;
using Repositories.ResponseModels;

namespace Repositories.IRepositories
{
    public interface ITourBidRepository : IGenericRepository<TourBid>
    {
        Task<PagedResult<TourBidListResult>> GetBids(string content, int accountIdFrom, int pageSize, int pageIndex);
        Task<PagedResult<TourBid>> GetBidsOf(int accountId, int pageSize, int pageIndex);
        Task<bool> LikeOrUnlikeBid(int accountId, int tourBidId);
        Task<bool> UpdateAsync(TourBid entity);

        Task<bool> RemoveAsync(int id);
    }
}
