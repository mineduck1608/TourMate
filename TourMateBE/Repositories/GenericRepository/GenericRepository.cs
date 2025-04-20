using Microsoft.EntityFrameworkCore;
using Repositories.Context;
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
        protected TourMateContext _context;

        public GenericRepository()
        {
            _context ??= new();
        }

        public GenericRepository(TourMateContext context)
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
        public async Task<List<T>> GetAllAsync(int pageSize, int pageIndex)
        {
            return await _context.Set<T>()
                .Skip(pageSize * (pageIndex - 1))
                .Take(pageSize)
                .ToListAsync();
        }
        public void Create(T entity)
        {
            _context.Add(entity);
            _context.SaveChanges();
        }

        public async Task<int> CreateAsync(T entity)
        {
            _context.Add(entity);
            return await _context.SaveChangesAsync();
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

        public async Task<int> UpdateAsync(T entity)
        {
            //var trackerEntity = _context.Set<T>().Local.FirstOrDefault(e => e == entity);
            //if (trackerEntity != null)
            //{
            //    _context.Entry(trackerEntity).State = EntityState.Detached;
            //}
            //var tracker = _context.Attach(entity);
            //tracker.State = EntityState.Modified;
            //return await _context.SaveChangesAsync();

            var tracker = _context.Attach(entity);
            tracker.State = EntityState.Modified;
            return await _context.SaveChangesAsync();

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
