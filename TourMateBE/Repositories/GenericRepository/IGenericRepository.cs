using Repositories.ResponseModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repositories.GenericRepository
{
    public interface IGenericRepository<T> where T : class
    {
        List<T> GetAll(int pageSize, int pageIndex);
        Task<PagedResult<T>> GetAllPaged(int pageSize, int pageIndex, string sortBy = "CreatedAt", bool descending = true);
        Task<List<T>> GetAllAsync(int pageSize, int pageIndex);
        Task<List<T>> GetAllList();

        void Create(T entity);
        Task<bool> CreateAsync(T entity);
        Task<T> CreateAndReturnAsync(T entity);

        void Update(T entity);
        Task<bool> UpdateAsync(T entity);

        bool Remove(T entity);
        bool Remove(int id);
        Task<bool> RemoveAsync(T entity);
        Task<bool> RemoveAsync(int id);

        T GetById(int id);
        Task<T> GetByIdAsync(int id);

        T GetById(string code);
        Task<T> GetByIdAsync(string code);

        T GetById(Guid code);
        Task<T> GetByIdAsync(Guid code);

        void PrepareCreate(T entity);
        void PrepareUpdate(T entity);
        void PrepareRemove(T entity);
        int Save();
        Task<int> SaveAsync();
    }
}
