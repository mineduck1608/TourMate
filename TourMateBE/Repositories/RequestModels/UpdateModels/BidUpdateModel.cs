using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.DTO.UpdateModels
{
    public class BidUpdateModel
    {
        public int BidId { get; set; }
        public string Status { get; set; } = "Hoạt động"; // Default status is "Hoạt động" (Active)
        public int TourGuideId { get; set; }
        public int TourBidId { get; set; }

        public float Amount { get; set; }
        public string Comment { get; set; }
        public Bid Convert() => new()
        {
            Status = Status,            
            Amount = Amount,
            TourGuideId = TourGuideId,
            BidId = BidId,
            TourBidId = TourBidId,
            Comment = Comment
        };
    }
}
