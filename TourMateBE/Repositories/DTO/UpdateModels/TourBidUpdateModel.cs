using Repositories.Models;

namespace Repositories.DTO.UpdateModels
{
    public class TourBidUpdateModel
    {
        public int TourBidId { get; set; }
        public int AccountId { get; set; }

        public int PlaceRequested { get; set; }

        public string Content { get; set; }

        public float? MaxPrice { get; set; }
        public bool IsDeleted { get; set; } = false;
        public string Status { get; set; }
        public TourBid Convert() => new()
        {
            AccountId = AccountId,
            Content = Content,
            MaxPrice = MaxPrice,
            IsDeleted = IsDeleted,
            Status = Status,            
            PlaceRequested = PlaceRequested,
            UpdatedAt = DateTime.Now,
            TourBidId = TourBidId,
        };
    }
}