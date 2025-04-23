using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface IActiveAreaService
    {
        ActiveArea GetActiveArea(int id);
        IEnumerable<ActiveArea> GetAll(int pageSize, int pageIndex);
        void CreateActiveArea(ActiveArea activearea);
        void UpdateActiveArea(ActiveArea activearea);
        bool DeleteActiveArea(int id);
    }

    public class ActiveAreaService : IActiveAreaService
    {
        private ActiveAreaRepository ActiveAreaRepository { get; set; } = new();

        public ActiveArea GetActiveArea(int id)
        {
            return ActiveAreaRepository.GetById(id);
        }

        public IEnumerable<ActiveArea> GetAll(int pageSize, int pageIndex)
        {
            return ActiveAreaRepository.GetAll(pageSize, pageIndex);
        }

        public void CreateActiveArea(ActiveArea activearea)
        {
            ActiveAreaRepository.Create(activearea);
        }

        public void UpdateActiveArea(ActiveArea activearea)
        {
            ActiveAreaRepository.Update(activearea);
        }

        public bool DeleteActiveArea(int id)
        {
            ActiveAreaRepository.Remove(id);
            return true;
        }
    }
}