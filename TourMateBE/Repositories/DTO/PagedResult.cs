using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.DTO
{
    public class PagedResult<T>
    {
        public int TotalResult { get; set; }
        public int TotalPage { get; set; }
        public IList<T> Result { get; set; }
    }
}
