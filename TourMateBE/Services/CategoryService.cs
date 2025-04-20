using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface ICategoryService
    {
        Category GetCategory(int id);
        IEnumerable<Category> GetAll(int pageSize, int pageIndex);
        void CreateCategory(Category category);
        void UpdateCategory(Category category);
        bool DeleteCategory(int id);
    }

    public class CategoryService : ICategoryService
    {
        private CategoryRepository CategoryRepository { get; set; } = new();

        public Category GetCategory(int id)
        {
            return CategoryRepository.GetById(id);
        }

        public IEnumerable<Category> GetAll(int pageSize, int pageIndex)
        {
            return CategoryRepository.GetAll(pageSize, pageIndex);
        }

        public void CreateCategory(Category category)
        {
            CategoryRepository.Create(category);
        }

        public void UpdateCategory(Category category)
        {
            CategoryRepository.Update(category);
        }

        public bool DeleteCategory(int id)
        {
            CategoryRepository.Remove(id);
            return true;
        }
    }
}