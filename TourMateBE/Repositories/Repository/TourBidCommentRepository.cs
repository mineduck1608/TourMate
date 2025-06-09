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
                .Skip(pageSize * (pageIndex - 1))
                .Take(pageSize)
                .OrderByDescending(x => x.CreatedAt)
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
        public async Task<bool> DeleteCommentAsync(int commentId)
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
    }
}
