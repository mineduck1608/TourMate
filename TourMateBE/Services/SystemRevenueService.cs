using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface ISystemRevenueService
    {
        SystemRevenue GetSystemRevenue(int id);
        IEnumerable<SystemRevenue> GetAll(int pageSize, int pageIndex);
        void CreateSystemRevenue(SystemRevenue systemrevenue);
        void UpdateSystemRevenue(SystemRevenue systemrevenue);
        bool DeleteSystemRevenue(int id);
    }

    public class SystemRevenueService : ISystemRevenueService
    {
        private SystemRevenueRepository SystemRevenueRepository { get; set; } = new();

        public SystemRevenue GetSystemRevenue(int id)
        {
            return SystemRevenueRepository.GetById(id);
        }

        public IEnumerable<SystemRevenue> GetAll(int pageSize, int pageIndex)
        {
            return SystemRevenueRepository.GetAll(pageSize, pageIndex);
        }

        public void CreateSystemRevenue(SystemRevenue systemrevenue)
        {
            SystemRevenueRepository.Create(systemrevenue);
        }

        public void UpdateSystemRevenue(SystemRevenue systemrevenue)
        {
            SystemRevenueRepository.Update(systemrevenue);
        }

        public bool DeleteSystemRevenue(int id)
        {
            SystemRevenueRepository.Remove(id);
            return true;
        }
    }
}