using Repositories.DTO.ResultModels;
using Repositories.Models;
using Repositories.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
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
    public class TourBidCommentService : ITourBidCommentService
    {
        private TourBidCommentRepository TourBidCommentRepository { get; set; }
        public TourBidCommentService(TourBidCommentRepository tourBidCommentRepository)
        {
            TourBidCommentRepository = tourBidCommentRepository;
        }
        public async Task<PagedResult<CommentListResult>> GetCommentsByTourBidIdAsync(int tourBidId, int pageSize, int pageIndex)
        {
            return await TourBidCommentRepository.GetCommentsByTourBidIdAsync(tourBidId, pageSize, pageIndex);
        }

        public async Task<bool> Create(TourBidComment comment)
        {
            return await TourBidCommentRepository.CreateAsync(comment);
        }
        public async Task<bool> Update(TourBidComment comment)
        {
            return await TourBidCommentRepository.UpdateAsync(comment);
        }
        public async Task<bool> DeleteComment(int commentId)
        {
            return await TourBidCommentRepository.RemoveAsync(commentId);
        }
    }
}
