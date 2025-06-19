using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class BidCreateModel
    {
        public int TourGuideId { get; set; }
        public int TourBidId { get; set; }

        public float Amount { get; set; }
        public string Comment { get; set; }
        public Bid Convert() => new()
        {
            Status = "Hoạt động",
            Amount = Amount,
            TourGuideId = TourGuideId,
            CreatedAt = DateTime.Now,
            BidId = 0,
            TourBidId = TourBidId,
            Comment = Comment
        };
    }
}