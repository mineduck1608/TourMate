using Repositories.DTO;
using Repositories.Models;
using Repositories.ResponseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
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
}
