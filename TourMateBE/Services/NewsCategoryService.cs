using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface INewsCategoryService
    {
        NewsCategory GetNewsCategory(int id);
        IEnumerable<NewsCategory> GetAll(int pageSize, int pageIndex);
        void CreateNewsCategory(NewsCategory newscategory);
        void UpdateNewsCategory(NewsCategory newscategory);
        bool DeleteNewsCategory(int id);
    }

    public class NewsCategoryService : INewsCategoryService
    {
        private NewsCategoryRepository NewsCategoryRepository { get; set; } = new();

        public NewsCategory GetNewsCategory(int id)
        {
            return NewsCategoryRepository.GetById(id);
        }

        public IEnumerable<NewsCategory> GetAll(int pageSize, int pageIndex)
        {
            return NewsCategoryRepository.GetAll(pageSize, pageIndex);
        }

        public void CreateNewsCategory(NewsCategory newscategory)
        {
            NewsCategoryRepository.Create(newscategory);
        }

        public void UpdateNewsCategory(NewsCategory newscategory)
        {
            NewsCategoryRepository.Update(newscategory);
        }

        public bool DeleteNewsCategory(int id)
        {
            NewsCategoryRepository.Remove(id);
            return true;
        }
    }
}