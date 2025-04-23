using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class RoleCreateModel
    {
        public string RoleName { get; set; }
        public Role Convert() => new Role { RoleName = RoleName };
    }
}