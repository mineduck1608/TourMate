using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface INewsService
    {
        News GetNews(int id);
        IEnumerable<News> GetAll(int pageSize, int pageIndex);
        void CreateNews(News news);
        void UpdateNews(News news);
        bool DeleteNews(int id);
        Task<IEnumerable<News>> GetAllList();
    }

    public class NewsService : INewsService
    {
        private NewsRepository NewsRepository { get; set; } = new();

        public News GetNews(int id)
        {
            return NewsRepository.GetById(id);
        }

        public IEnumerable<News> GetAll(int pageSize, int pageIndex)
        {
            return NewsRepository.GetAll(pageSize, pageIndex);
        }

        public async Task<IEnumerable<News>> GetAllList()
        {
            var list = await NewsRepository.GetAllList(); 
            return list; 
        }


        public void CreateNews(News news)
        {
            NewsRepository.Create(news);
        }

        public void UpdateNews(News news)
        {
            NewsRepository.Update(news);
        }

        public bool DeleteNews(int id)
        {
            NewsRepository.Remove(id);
            return true;
        }
    }
}