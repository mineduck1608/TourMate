using Repositories.GenericRepository;
using Repositories.Models;
using Repositories.ResponseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.IRepositories
{
    public interface IBidRepository : IGenericRepository<Bid>
    {
        Task<PagedResult<BidListResult>> GetBidsOfTourBid(int tourBid, int pageSize, int pageIndex);
        Task<bool> AcceptBid(int bidId);
        Task<bool> UpdateAsync(Bid bid);
    }
}
