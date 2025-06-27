using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class TourBidCreateModel
    {
        public int AccountId { get; set; }

        public int PlaceRequested { get; set; }

        public string Content { get; set; }

        public float? MaxPrice { get; set; }
        public TourBid Convert() => new TourBid
        {
            AccountId = AccountId,
            CreatedAt = DateTime.Now,
            IsDeleted = false,
            Content = Content,
            MaxPrice = MaxPrice,
            Status = "Hoạt động",
            PlaceRequested = PlaceRequested,
            TourBidId = 0
        };
    }
}