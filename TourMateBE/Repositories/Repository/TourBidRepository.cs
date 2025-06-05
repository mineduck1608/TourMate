using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using Repositories.DTO;
using Repositories.GenericRepository;
using Repositories.Models;
using System.Linq.Expressions;

namespace Repositories.Repository
{
    public class TourBidRepository : GenericRepository<TourBid>
    {
        public async Task<PagedResult<TourBidListResult>> GetBids(string content, int accountIdFrom, int pageSize, int pageIndex)
        {
            content = content != null ? content.Trim().ToLower() : "";
            var query = _context.TourBids
                .Where(x =>
                !x.IsDeleted &&
                (string.IsNullOrEmpty(content) || x.Content.ToLower().Contains(content)))
                .OrderByDescending(x => x.CreatedAt)
                .AsQueryable();
            var totalItems = await query.CountAsync();
            var result = await query
                .Skip(pageSize * (pageIndex - 1))
                .Take(pageSize)
                .Include(x => x.PlaceRequestedNavigation)
                .Include(x => x.Account)
                .ThenInclude(x => x.Customers)
                .Include(x => x.UserLikeBids)
                .Select(x => new TourBidListResult()
                {
                    AccountId = x.AccountId,
                    TourBidId = x.TourBidId,
                    Content = x.Content,
                    CreatedAt = x.CreatedAt,
                    CustomerName = x.Account.Customers.FirstOrDefault().FullName,
                    PlaceRequested = x.PlaceRequested,
                    IsLiked = x.UserLikeBids.Any(y => y.AccountId == accountIdFrom),
                    LikeCount = x.UserLikeBids.Count,
                    CustomerImg = x.Account.Customers.FirstOrDefault().Image,
                    MaxPrice = x.MaxPrice,
                    PlaceRequestedName = x.PlaceRequestedNavigation.AreaName,
                    Status = x.Status                    
                }).ToListAsync()
                ;
            return new PagedResult<TourBidListResult>
            {
                Result = result,
                TotalResult = totalItems,
                TotalPage = (int)Math.Ceiling((double)totalItems / pageSize)
            };
        }

        public async Task<PagedResult<TourBid>> GetBidsOf(int accountId, int pageSize, int pageIndex)
        {
            var query = _context.TourBids
                .Where(x => x.AccountId == accountId)
                .OrderByDescending(x => x.CreatedAt)
                .AsQueryable();
            var totalItems = await query.CountAsync();
            var result = await query
                .Skip(pageSize * (pageIndex - 1))
                .Take(pageSize)
                .Include(x => x.PlaceRequestedNavigation)
                .ToListAsync();
            return new PagedResult<TourBid>
            {
                Result = result,
                TotalResult = totalItems,
                TotalPage = (int)Math.Ceiling((double)totalItems / pageSize)
            };
        }
        public new async Task<bool> UpdateAsync(TourBid entity)
        {
            try
            {
                var existingEntity = _context.TourBids.FirstOrDefault(x => x.TourBidId == entity.TourBidId);
                if (existingEntity != null)
                {
                    entity.CreatedAt = existingEntity.CreatedAt; // Preserve the original CreatedAt
                    _context.Entry(existingEntity).CurrentValues.SetValues(entity);
                    await _context.SaveChangesAsync();
                    return true;
                }
            }
            catch (Exception ex)
            {

            }
            return false;
        }
    }
}