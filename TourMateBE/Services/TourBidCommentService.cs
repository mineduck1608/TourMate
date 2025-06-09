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
        // Task DeleteCommentAsync(int commentId);
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
    }
}
