using Repositories.DTO;
using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface INewsService
    {
        Task<News> GetNews(int id);
        Task<PagedResult<News>> GetAll(int pageSize, int pageIndex);
        Task CreateNews(News news);
        Task UpdateNews(News news);
        Task<bool> DeleteNews(int id);
        Task<IEnumerable<News>> GetAllList();
    }

    public class NewsService : INewsService
    {
        private NewsRepository NewsRepository { get; set; } = new();

        public async Task<News> GetNews(int id)
        {
            return await NewsRepository.GetByIdAsync(id);
        }

        public async Task<PagedResult<News>> GetAll(int pageSize, int pageIndex)
        {
            return await NewsRepository.GetAllPaged(pageSize, pageIndex);
        }

        public async Task<IEnumerable<News>> GetAllList()
        {
            var list = await NewsRepository.GetAllList(); 
            return list; 
        }


        public async Task CreateNews(News news)
        {
            await NewsRepository.CreateAsync(news);
        }

        public async Task UpdateNews(News news)
        {
            await NewsRepository.UpdateAsync(news);
        }

        public async Task<bool> DeleteNews(int id)
        {
            await NewsRepository.RemoveAsync(id);
            return true;
        }
    }
}