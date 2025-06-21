using Repositories.Models;
using Repositories.IRepositories;
using Services.IServices;

namespace Services.Services
{
    public class RoleService : IRoleService
    {
        private IRoleRepository RoleRepository;

        public RoleService(IRoleRepository roleRepository)
        {
            RoleRepository = roleRepository ?? throw new ArgumentNullException(nameof(roleRepository));
        }

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