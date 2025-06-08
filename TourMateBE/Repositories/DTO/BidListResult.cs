using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.DTO
{
    public class BidListResult
    {
        public int BidId { get; set; }

        public int TourBidId { get; set; }

        public int TourGuideId { get; set; }

        public float Amount { get; set; }

        public DateTime CreatedAt { get; set; }

        public string? Comment { get; set; }

        public string Status { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string Image { get; set; } = null!;
    }
}
