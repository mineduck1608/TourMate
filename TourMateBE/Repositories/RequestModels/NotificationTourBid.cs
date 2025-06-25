using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.RequestModels
{
    public class NotificationTourBid
    {
        public int AreaId { get; set; } // hoặc LocationId
        public int AccId { get; set; }
    }
}
