using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface INewsCommentsService
    {
        NewsComment GetNewsComments(int id);
        IEnumerable<NewsComment> GetAll(int pageSize, int pageIndex);
        void CreateNewsComments(NewsComment newscomments);
        void UpdateNewsComments(NewsComment newscomments);
        bool DeleteNewsComments(int id);
    }

    public class NewsCommentsService : INewsCommentsService
    {
        private NewsCommentsRepository NewsCommentsRepository { get; set; } = new();

        public NewsComment GetNewsComments(int id)
        {
            return NewsCommentsRepository.GetById(id);
        }

        public IEnumerable<NewsComment> GetAll(int pageSize, int pageIndex)
        {
            return NewsCommentsRepository.GetAll(pageSize, pageIndex);
        }

        public void CreateNewsComments(NewsComment newscomments)
        {
            NewsCommentsRepository.Create(newscomments);
        }

        public void UpdateNewsComments(NewsComment newscomments)
        {
            NewsCommentsRepository.Update(newscomments);
        }

        public bool DeleteNewsComments(int id)
        {
            NewsCommentsRepository.Remove(id);
            return true;
        }
    }
}