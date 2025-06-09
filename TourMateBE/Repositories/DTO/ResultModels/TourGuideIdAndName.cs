using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.DTO.ResultModels
{
    public class TourGuideIdAndName
    {
        public int TourGuideId { get; set; }
        public string FullName { get; set; } = string.Empty;
    }
}
