using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface IFeedbackService
    {
        Task<Feedback> GetFeedback(int id);
        Task<Feedback> GetFeedbackByInvoice(int id);

        IEnumerable<Feedback> GetAll(int pageSize, int pageIndex);
        Task<bool> CreateFeedback(Feedback feedback);
        Task<bool> UpdateFeedback(Feedback feedback);
        Task<bool> DeleteFeedback(int id);
    }

    public class FeedbackService : IFeedbackService
    {
        private FeedbackRepository FeedbackRepository { get; set; } = new();

        public async Task<Feedback> GetFeedback(int id)
        {
            return await FeedbackRepository.GetByIdAsync(id);
        }

        public async Task<Feedback> GetFeedbackByInvoice(int id)
        {
            return await FeedbackRepository.GetByInvoice(id);
        }

        public IEnumerable<Feedback> GetAll(int pageSize, int pageIndex)
        {
            return FeedbackRepository.GetAll(pageSize, pageIndex);
        }

        public async Task<bool> CreateFeedback(Feedback feedback)
        {
            return await FeedbackRepository.CreateAsync(feedback);
        }

        public async Task<bool> UpdateFeedback(Feedback feedback)
        {
            return await FeedbackRepository.UpdateAsync(feedback);
        }

        public async Task<bool> DeleteFeedback(int id)
        {
            await FeedbackRepository.RemoveAsync(id);
            return true;
        }
    }
}