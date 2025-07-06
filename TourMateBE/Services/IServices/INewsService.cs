using Repositories.Models;
using Repositories.ResponseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface INewsService
    {
        Task<News> GetNews(int id);
        Task<PagedResult<News>> GetAll(int pageSize, int pageIndex);
        Task<bool> CreateNews(News news);
        Task<bool> UpdateNews(News news);
        Task<bool> DeleteNews(int id);
        Task<IEnumerable<News>> GetAllList();
        Task<PagedResult<News>> FilterByCategory(int pageSize, int pageIndex, string category, bool excludeContent);
        Task<List<News>> GetRecentNews(int excludeId, int count);
    }
}
