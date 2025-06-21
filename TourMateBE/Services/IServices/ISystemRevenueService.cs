using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface ISystemRevenueService
    {
        SystemRevenue GetSystemRevenue(int id);
        IEnumerable<SystemRevenue> GetAll(int pageSize, int pageIndex);
        void CreateSystemRevenue(SystemRevenue systemrevenue);
        void UpdateSystemRevenue(SystemRevenue systemrevenue);
        bool DeleteSystemRevenue(int id);
    }
}
