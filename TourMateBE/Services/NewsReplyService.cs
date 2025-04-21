using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface INewsReplyService
    {
        NewsReply GetNewsReply(int id);
        IEnumerable<NewsReply> GetAll(int pageSize, int pageIndex);
        void CreateNewsReply(NewsReply newsreply);
        void UpdateNewsReply(NewsReply newsreply);
        bool DeleteNewsReply(int id);
    }

    public class NewsReplyService : INewsReplyService
    {
        private NewsReplyRepository NewsReplyRepository { get; set; } = new();

        public NewsReply GetNewsReply(int id)
        {
            return NewsReplyRepository.GetById(id);
        }

        public IEnumerable<NewsReply> GetAll(int pageSize, int pageIndex)
        {
            return NewsReplyRepository.GetAll(pageSize, pageIndex);
        }

        public void CreateNewsReply(NewsReply newsreply)
        {
            NewsReplyRepository.Create(newsreply);
        }

        public void UpdateNewsReply(NewsReply newsreply)
        {
            NewsReplyRepository.Update(newsreply);
        }

        public bool DeleteNewsReply(int id)
        {
            NewsReplyRepository.Remove(id);
            return true;
        }
    }
}