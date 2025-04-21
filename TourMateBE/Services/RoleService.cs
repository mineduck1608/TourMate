using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface IRoleService
    {
        Role GetRole(int id);
        IEnumerable<Role> GetAll(int pageSize, int pageIndex);
        void CreateRole(Role role);
        void UpdateRole(Role role);
        bool DeleteRole(int id);
    }

    public class RoleService : IRoleService
    {
        private RoleRepository RoleRepository { get; set; } = new();

        public Role GetRole(int id)
        {
            return RoleRepository.GetById(id);
        }

        public IEnumerable<Role> GetAll(int pageSize, int pageIndex)
        {
            return RoleRepository.GetAll(pageSize, pageIndex);
        }

        public void CreateRole(Role role)
        {
            RoleRepository.Create(role);
        }

        public void UpdateRole(Role role)
        {
            RoleRepository.Update(role);
        }

        public bool DeleteRole(int id)
        {
            RoleRepository.Remove(id);
            return true;
        }
    }
}