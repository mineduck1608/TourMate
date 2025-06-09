using Microsoft.EntityFrameworkCore;
using Repositories.Context;
using Repositories.DTO.ResultModels;
using Repositories.GenericRepository;
using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Repository
{
    public class TourBidCommentRepository : GenericRepository<TourBidComment>
    {
        public TourBidCommentRepository()
        {
            _context = new();
        }
        public async Task<PagedResult<CommentListResult>> GetCommentsByTourBidIdAsync(int tourBidId, int pageSize, int pageIndex)
        {
            var query = _context.TourBidComments
                .Where(c => c.TourBidId == tourBidId && !c.IsDeleted);
            var count = await query.CountAsync();
            var result = await query
                .OrderByDescending(x => x.CreatedAt)
                .Skip(pageSize * (pageIndex - 1))
                .Take(pageSize)
                .Include(c => c.Account) // Include Account details if needed
                .ThenInclude(x => x.Customers) // Include Customers details if needed
                .Include(c => c.Account)
                .ThenInclude(x => x.TourGuides)
                .Select(x => new CommentListResult()
                {
                    AccountId = x.AccountId,
                    CommentId = x.CommentId,
                    Content = x.Content,
                    CreatedAt = x.CreatedAt,
                    FullName = x.Account.Customers.FirstOrDefault().FullName ?? x.Account.TourGuides.FirstOrDefault().FullName ?? "Unknown",
                    Image = x.Account.Customers.FirstOrDefault().Image ?? x.Account.TourGuides.FirstOrDefault().Image ?? "default_image.png",
                    TourBidId = x.TourBidId
                }).ToListAsync();
            var totalPage = (int)Math.Ceiling((double)count / pageSize);
            return new()
            {
                Result = result,
                TotalPage = totalPage,
                TotalResult = count
            };
        }
        public new async Task<bool> RemoveAsync(int commentId)
        {
            try
            {
                var comment = await _context.TourBidComments.FindAsync(commentId);
                if (comment != null)
                {
                    comment.IsDeleted = true;
                    await _context.SaveChangesAsync();
                    return true;
                }
                return false;
            }
            catch
            {
                return false;
            }

        }
        public new async Task<bool> UpdateAsync(TourBidComment comment)
        {
            try
            {
                var c = await _context.TourBidComments.FirstOrDefaultAsync(x => x.CommentId == comment.CommentId);
                if (c == null) return false;
                comment.IsDeleted = c.IsDeleted;
                comment.CreatedAt = c.CreatedAt;
                _context.Entry(c).CurrentValues.SetValues(comment);
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
