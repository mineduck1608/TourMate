using Repositories.Models;
using Repositories.ResponseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface IBidService
    {
        Bid GetBid(int id);
        IEnumerable<Bid> GetAll(int pageSize, int pageIndex);
        Task<bool> CreateBid(Bid bid);
        Task<bool> UpdateBid(Bid bid);
        Task<bool> DeleteBid(int id);
        Task<PagedResult<BidListResult>> GetBidsOfTourBid(int tourBid, int pageSize, int pageIndex);
        Task<bool> AcceptBid(int bidId);
    }
}
