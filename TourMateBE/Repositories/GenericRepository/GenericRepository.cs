using Microsoft.EntityFrameworkCore;
using Repositories.Context;
using Repositories.DTO.ResultModels;
using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.GenericRepository
{
    public class GenericRepository<T> where T : class
    {
        protected TourmateContext _context;

        public GenericRepository()
        {
            _context ??= new();
        }

        public GenericRepository(TourmateContext context)
        {
            _context = context;
        }

        public List<T> GetAll(int pageSize, int pageIndex)
        {
            return _context.Set<T>()
                .Skip(pageSize * (pageIndex - 1))
                .Take(pageSize)
                .ToList();
        }
        public async Task<PagedResult<T>> GetAllPaged(int pageSize, int pageIndex, string sortBy = "CreatedAt", bool descending = true)
        {
            var query = _context.Set<T>().AsQueryable();

            // Sắp xếp theo trường được chỉ định
            if (descending)
            {
                query = query.OrderByDescending(e => EF.Property<object>(e, sortBy));
            }
            else
            {
                query = query.OrderBy(e => EF.Property<object>(e, sortBy));
            }

            // Phân trang
            var result = await query
                .Skip(pageSize * (pageIndex - 1))
                .Take(pageSize)
                .ToListAsync();

            // Lấy tổng số bản ghi
            var totalAmount = await _context.Set<T>().CountAsync();

            return new PagedResult<T>
            {
                Result = result,
                TotalResult = totalAmount,
                TotalPage = totalAmount / pageSize + (totalAmount % pageSize != 0 ? 1 : 0)
            };
        }
        public async Task<List<T>> GetAllAsync(int pageSize, int pageIndex)
        {
            var result = await _context.Set<T>()
                .Skip(pageSize * (pageIndex - 1))
                .Take(pageSize)
                .ToListAsync();
            return result;
        }
        public async Task<List<T>> GetAllList()
        {
            return await _context.Set<T>()
                .ToListAsync();
        }
        public void Create(T entity)
        {
            _context.Add(entity);
            _context.SaveChanges();
        }

        public async Task<bool> CreateAsync(T entity)
        {
            try
            {
                _context.Add(entity);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<T> CreateAndReturnAsync(T entity)
        {
            try
            {
                _context.Add(entity);
                await _context.SaveChangesAsync();
                return entity;
            }
            catch
            {
                return entity;
            }
        }

        public void Update(T entity)
        {
            var tracker = _context.Attach(entity);
            tracker.State = EntityState.Modified;
            _context.SaveChanges();

            //if (_context.Entry(entity).State == EntityState.Detached)
            //{
            //    var tracker = _context.Attach(entity);
            //    tracker.State = EntityState.Modified;
            //}
            //_context.SaveChanges();
        }
        public async Task<bool> UpdateAsync(T entity)
        {
            //var trackerEntity = _context.Set<T>().Local.FirstOrDefault(e => e == entity);
            //if (trackerEntity != null)
            //{
            //    _context.Entry(trackerEntity).State = EntityState.Detached;
            //}
            //var tracker = _context.Attach(entity);
            //tracker.State = EntityState.Modified;
            //return await _context.SaveChangesAsync();
            try
            {
                var tracker = _context.Attach(entity);
                tracker.State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }

            //if (_context.Entry(entity).State == EntityState.Detached)
            //{
            //    var tracker = _context.Attach(entity);
            //    tracker.State = EntityState.Modified;
            //}

            //return await _context.SaveChangesAsync();
        }

        public bool Remove(T entity)
        {
            _context.Remove(entity);
            _context.SaveChanges();
            return true;
        }

        public bool Remove(int id)
        {
            _context.Remove(GetById(id));
            _context.SaveChanges();
            return true;
        }

        public async Task<bool> RemoveAsync(T entity)
        {
            _context.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveAsync(int id)
        {
            _context.Remove(GetById(id));
            await _context.SaveChangesAsync();
            return true;
        }

        public T GetById(int id)
        {
            var entity = _context.Set<T>().Find(id);
            if (entity != null)
            {
                _context.Entry(entity).State = EntityState.Detached;
            }

            return entity;

            //return _context.Set<T>().Find(id);
        }

        public async Task<T> GetByIdAsync(int id)
        {
            var entity = await _context.Set<T>().FindAsync(id);
            if (entity != null)
            {
                _context.Entry(entity).State = EntityState.Detached;
            }

            return entity;

            //return await _context.Set<T>().FindAsync(id);
        }

        public T GetById(string code)
        {
            var entity = _context.Set<T>().Find(code);
            if (entity != null)
            {
                _context.Entry(entity).State = EntityState.Detached;
            }

            return entity;

            //return _context.Set<T>().Find(code);
        }

        public async Task<T> GetByIdAsync(string code)
        {
            var entity = await _context.Set<T>().FindAsync(code);
            if (entity != null)
            {
                _context.Entry(entity).State = EntityState.Detached;
            }

            return entity;

            //return await _context.Set<T>().FindAsync(code);
        }

        public T GetById(Guid code)
        {
            var entity = _context.Set<T>().Find(code);
            if (entity != null)
            {
                _context.Entry(entity).State = EntityState.Detached;
            }

            return entity;

            //return _context.Set<T>().Find(code);
        }

        public async Task<T> GetByIdAsync(Guid code)
        {
            var entity = await _context.Set<T>().FindAsync(code);
            if (entity != null)
            {
                _context.Entry(entity).State = EntityState.Detached;
            }

            return entity;

            //return await _context.Set<T>().FindAsync(code);
        }

        #region Separating asigned entity and save operators        

        public void PrepareCreate(T entity)
        {
            _context.Add(entity);
        }

        public void PrepareUpdate(T entity)
        {
            var tracker = _context.Attach(entity);
            tracker.State = EntityState.Modified;
        }

        public void PrepareRemove(T entity)
        {
            _context.Remove(entity);
        }

        public int Save()
        {
            return _context.SaveChanges();
        }

        public async Task<int> SaveAsync()
        {
            return await _context.SaveChangesAsync();
        }

        #endregion Separating asign entity and save operators
    }
}
