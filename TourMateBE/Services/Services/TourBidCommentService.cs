using Repositories.Models;
using Repositories.IRepositories;
using Repositories.ResponseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Services.IServices;

namespace Services.Services
{
    public class TourBidCommentService : ITourBidCommentService
    {
        private ITourBidCommentRepository TourBidCommentRepository { get; set; }

        public TourBidCommentService(ITourBidCommentRepository tourBidCommentRepository)
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
