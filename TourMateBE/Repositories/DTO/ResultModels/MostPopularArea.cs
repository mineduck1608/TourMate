using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.DTO.ResultModels
{
    public class MostPopularArea
    {
        public int AreaId { get; set; }
        public string AreaName { get; set; }
        public int TourBidCount { get; set; }
    }
}
