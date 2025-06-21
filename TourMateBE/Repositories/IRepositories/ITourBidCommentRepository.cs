using Repositories.GenericRepository;
using Repositories.Models;
using Repositories.ResponseModels;

namespace Repositories.IRepositories
{
    public interface ITourBidCommentRepository : IGenericRepository<TourBidComment>
    {
        Task<PagedResult<CommentListResult>> GetCommentsByTourBidIdAsync(int tourBidId, int pageSize, int pageIndex);
        Task<bool> UpdateAsync(TourBidComment comment);
        Task<bool> RemoveAsync(int commentId);
    }
}
