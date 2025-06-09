using Repositories.Models;
using Repositories.GenericRepository;
using Microsoft.EntityFrameworkCore;
using Repositories.DTO.ResultModels;

namespace Repositories.Repository
{
    public class BidRepository : GenericRepository<Bid>
    {
        public async Task<PagedResult<BidListResult>> GetBidsOfTourBid(int tourBid, int pageSize, int pageIndex)
        {
            var query = _context.Bids
                .Where(x => x.TourBidId == tourBid)
                .OrderByDescending(x => x.CreatedAt)
                .AsQueryable();
            var totalItems = await query.CountAsync();
            var result = await query
                .Skip(pageSize * (pageIndex - 1))
                .Take(pageSize)
                .Include(x => x.TourGuide)
                .Select(x => new BidListResult()
                {
                    BidId = x.BidId,
                    TourBidId = x.TourBidId,
                    TourGuideId = x.TourGuideId,
                    FullName = x.TourGuide.FullName,
                    Image = x.TourGuide.Image,
                    Amount = x.Amount,
                    Comment = x.Comment,
                    Status = x.Status,
                    CreatedAt = x.CreatedAt
                })
                .ToListAsync();
            return new ()
            {
                Result = result,
                TotalResult = totalItems,
                TotalPage = (int)Math.Ceiling((double)totalItems / pageSize)
            };
        }
        public new async Task<bool> UpdateAsync(Bid bid)
        {
            try
            {
                var existingBid = _context.Bids.FirstOrDefault(x => x.BidId == bid.BidId);
                bid.CreatedAt = existingBid.CreatedAt;
                _context.Entry(existingBid).CurrentValues.SetValues(bid);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}