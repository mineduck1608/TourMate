using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class BidCreateModel
    {
        public int TourGuideId { get; set; }
        public int TourBidId { get; set; }

        public float Amount { get; set; }

        public DateTime CreatedAt { get; set; }

        public string Comment { get; set; }

        public string Status { get; set; }
        public Bid Convert() => new()
        {
            Status = Status,
            Amount = Amount,
            TourGuideId = TourGuideId,
            CreatedAt = CreatedAt,
            BidId = 0,
            TourBidId = TourBidId,
            Comment = Comment
        };
    }
}