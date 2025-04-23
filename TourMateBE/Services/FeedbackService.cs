using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface IFeedbackService
    {
        Feedback GetFeedback(int id);
        IEnumerable<Feedback> GetAll(int pageSize, int pageIndex);
        void CreateFeedback(Feedback feedback);
        void UpdateFeedback(Feedback feedback);
        bool DeleteFeedback(int id);
    }

    public class FeedbackService : IFeedbackService
    {
        private FeedbackRepository FeedbackRepository { get; set; } = new();

        public Feedback GetFeedback(int id)
        {
            return FeedbackRepository.GetById(id);
        }

        public IEnumerable<Feedback> GetAll(int pageSize, int pageIndex)
        {
            return FeedbackRepository.GetAll(pageSize, pageIndex);
        }

        public void CreateFeedback(Feedback feedback)
        {
            FeedbackRepository.Create(feedback);
        }

        public void UpdateFeedback(Feedback feedback)
        {
            FeedbackRepository.Update(feedback);
        }

        public bool DeleteFeedback(int id)
        {
            FeedbackRepository.Remove(id);
            return true;
        }
    }
}