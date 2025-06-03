using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.DTO.UpdateModels
{
    public class CustomerUpdateModel
    {
        public int CustomerId { get; set; }
        public int AccountId { get; set; }

        public string FullName { get; set; } = null!;

        public string Gender { get; set; } = null!;

        public DateOnly DateOfBirth { get; set; }

        public string Phone { get; set; } = null!;

        public string? Image { get; set; }
    }
}
