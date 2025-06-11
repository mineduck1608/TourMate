using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.DTO.ResultModels
{
    public class AccountSearchResult
    {
        public int AccountId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public int RoleId { get; set; }
    }
}
