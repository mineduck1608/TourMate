using Repositories.Models;
using Repositories.IRepositories;
using Repositories.ResponseModels;
using Services.IServices;

namespace Services.Services
{   
    public class NewsService : INewsService
    {
        private INewsRepository NewsRepository;

        public NewsService(INewsRepository newsRepository)
        {
            NewsRepository = newsRepository ?? throw new ArgumentNullException(nameof(newsRepository));
        }

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


        public async Task<bool> CreateNews(News news)
        {
            return await NewsRepository.CreateAsync(news);
        }

        public async Task<bool> UpdateNews(News news)
        {

            return await NewsRepository.UpdateAsync(news);
        }

        public async Task<bool> DeleteNews(int id)
        {
            await NewsRepository.RemoveAsync(id);
            return true;
        }

        public async Task<PagedResult<News>> FilterByCategory(int pageSize, int pageIndex, string category, bool excludeContent)
        {
            return await NewsRepository.FilterByCategory(pageSize, pageIndex, category, excludeContent);
        }
        public async Task<List<News>> GetRecentNews(int excludeId, int count)
        {
            return await NewsRepository.GetRecentNews(excludeId, count);
        }
    }
}