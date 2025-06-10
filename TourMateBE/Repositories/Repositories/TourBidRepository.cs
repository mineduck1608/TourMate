using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using Repositories.DTO;
using Repositories.DTO.ResultModels;
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
            var tourGuide = await _context.TourGuides.FirstOrDefaultAsync(x => x.AccountId == accountIdFrom);
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
                .Include(x => x.Account)
                .ThenInclude(x => x.TourGuides)
                .Include(x => x.UserLikeBids)
                .Include(x => x.Bids)
                .Select(x => new TourBidListResult()
                {
                    AccountId = x.AccountId,
                    TourBidId = x.TourBidId,
                    Content = x.Content,
                    CreatedAt = x.CreatedAt,
                    CustomerName = x.Account.Customers.FirstOrDefault().FullName ?? x.Account.TourGuides.FirstOrDefault().FullName,
                    PlaceRequested = x.PlaceRequested,
                    IsLiked = x.UserLikeBids.Any(y => y.AccountId == accountIdFrom),
                    LikeCount = x.UserLikeBids.Count,
                    CustomerImg = x.Account.Customers.FirstOrDefault().Image ?? x.Account.TourGuides.FirstOrDefault().Image,
                    MaxPrice = x.MaxPrice,
                    PlaceRequestedName = x.PlaceRequestedNavigation.AreaName,
                    Status = x.Status,
                    IsBid = tourGuide != null && x.Bids.Any(b => b.TourGuideId == tourGuide.TourGuideId)
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

        public async Task<bool> LikeOrUnlikeBid(int accountId, int tourBidId)
        {
            try
            {
                var entry = await _context.UserLikeBids
                    .FirstOrDefaultAsync(x => x.AccountId == accountId && x.TourBidId == tourBidId);
                if (entry != null)
                {
                    _context.UserLikeBids.Remove(entry); // Unlike
                }
                else
                {
                    _context.UserLikeBids.Add(new UserLikeBid
                    {
                        AccountId = accountId,
                        TourBidId = tourBidId
                    }); // Like
                }
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                // Handle exceptions as needed
                return false;
            }
        }

        public new async Task<bool> RemoveAsync(int id)
        {
            try
            {
                var entity = await _context.TourBids.FindAsync(id);
                if (entity != null)
                {
                    entity.IsDeleted = true; // Soft delete
                    _context.Entry(entity).State = EntityState.Modified;
                    await _context.SaveChangesAsync();
                    return true;
                }
            }
            catch (Exception ex)
            {
                // Handle exceptions as needed
            }
            return false;
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