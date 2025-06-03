using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.DTO.UpdateModels
{
    public class CustomerAdminUpdateModel
    {
        public int CustomerId { get; set; }
        public int AccountId { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string Password { get; set; }
        public string Phone { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string Gender { get; set; }
    }
}
