using Repositories.GenericRepository;
using Repositories.Models;

namespace Repositories.IRepositories
{
    public interface IPlatformFeedbackRepository : IGenericRepository<PlatformFeedback>
    {
        Task<IEnumerable<PlatformFeedback>> GetAllPlatformFeedback();
        Task<PlatformFeedback?> GetPlatformFeedbackByIdAsync(int id);
        Task<IEnumerable<PlatformFeedback>> GetByAccountIdAsync(int accountId);
        Task<IEnumerable<PlatformFeedback>> GetByRatingAsync(int rating);
        Task<decimal> GetAverageRatingAsync();
        Task<Dictionary<int, int>> GetRatingDistributionAsync();
    }
}
