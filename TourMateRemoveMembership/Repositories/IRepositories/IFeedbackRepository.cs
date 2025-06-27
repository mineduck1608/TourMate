using Repositories.GenericRepository;
using Repositories.Models;

namespace Repositories.IRepositories
{
    public interface IFeedbackRepository : IGenericRepository<Feedback>
    {
        Task<Feedback?> GetByInvoiceAsync(int invoiceId);
        Task<List<Feedback>> GetByAccountAsync(int accountId);
        Task<Feedback?> GetByIdContainInvoiceAsync(int id);
        Task<List<Feedback>> GetTourGuideFeedbacksAsync(int tourGuideId, int page, int pageSize);
        Task<int> GetTourGuideFeedbackCountAsync(int tourGuideId);
        Task<IEnumerable<Feedback>> GetAllFeedbackAsync();
        Task<Feedback?> GetFeedbackByIdAsync(int id);
        Task<IEnumerable<Feedback>> GetByTourGuideIdAsync(int tourGuideId);
        Task<IEnumerable<Feedback>> GetByCustomerIdAsync(int customerId);
        Task<IEnumerable<Feedback>> GetByRatingAsync(int rating);
        Task<decimal> GetAverageRatingAsync();
        Task<Dictionary<int, int>> GetRatingDistributionAsync();
    }
}
