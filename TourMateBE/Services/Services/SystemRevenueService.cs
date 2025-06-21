using Repositories.Models;
using Repositories.IRepositories;
using Services.IServices;

namespace Services.Services
{
    public class SystemRevenueService : ISystemRevenueService
    {
        private ISystemRevenueRepository SystemRevenueRepository;

        public SystemRevenueService(ISystemRevenueRepository systemRevenueRepository)
        {
            SystemRevenueRepository = systemRevenueRepository ?? throw new ArgumentNullException(nameof(systemRevenueRepository));
        }

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