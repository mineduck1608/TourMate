using Repositories.Models;
using Repositories.ResponseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface ITourBidCommentService
    {
        // Define methods for the TourBidCommentService here
        // For example:
        Task<PagedResult<CommentListResult>> GetCommentsByTourBidIdAsync(int tourBidId, int pageSize, int pageIndex);
        Task<bool> Create(TourBidComment comment);
        Task<bool> Update(TourBidComment comment);
        Task<bool> DeleteComment(int commentId);
    }
}
