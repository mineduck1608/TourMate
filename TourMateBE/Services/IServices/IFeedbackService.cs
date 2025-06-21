using Repositories.Models;
using Repositories.RequestModels;
using Repositories.ResponseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface IFeedbackService
    {
        Task<Feedback> GetFeedback(int id);
        Task<Feedback> GetFeedbackContainInvoice(int id);
        Task<Feedback> GetFeedbackByInvoice(int id);
        Task<List<TourGuideFeedback>> GetFeedbackByAccount(int id);

        Task<Feedback> CreateFeedback(Feedback feedback);
        Task<bool> UpdateFeedback(Feedback feedback);
        Task<bool> DeleteFeedback(int id);
        string GenerateTourGuideFeedbackEmail(Feedback feedback);
        Task<PaginatedFeedbackResponse> GetTourGuideFeedbacksPublicAsync(int tourGuideId, int page, int pageSize);
        Task<IEnumerable<TourFeedbackDto>> GetAllTourFeedbacksAsync();
        Task<TourFeedbackDto?> GetTourFeedbackByIdAsync(int id);
        Task<IEnumerable<TourFeedbackDto>> GetTourFeedbacksByTourGuideIdAsync(int tourGuideId);
        Task<IEnumerable<TourFeedbackDto>> GetTourFeedbacksByRatingAsync(int rating);
        Task<FeedbackStatsDto> GetTourFeedbackStatsAsync();
        Task<IEnumerable<TopTourGuideDto>> GetTopTourGuidesAsync(int limit = 10);
    }

}
