using Repositories.Models;
using Repositories.RequestModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface IPlatformFeedbackService
    {
        Task<bool> CreatePlatformFeedback(PlatformFeedback data);
        Task<FeedbackStatsDto> GetPlatformFeedbackStatsAsync();
        Task<PlatformFeedbackDto> CreatePlatformFeedbackAsync(CreatePlatformFeedbackDto dto);
        Task<IEnumerable<PlatformFeedbackDto>> GetPlatformFeedbacksByRatingAsync(int rating);
        Task<PlatformFeedbackDto?> GetPlatformFeedbackByIdAsync(int id);
        Task<IEnumerable<PlatformFeedbackDto>> GetAllPlatformFeedbacksAsync();

    }

}
