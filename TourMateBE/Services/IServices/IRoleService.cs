using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface IRoleService
    {
        Role GetRole(int id);
        IEnumerable<Role> GetAll(int pageSize, int pageIndex);
        void CreateRole(Role role);
        void UpdateRole(Role role);
        bool DeleteRole(int id);
    }
}
