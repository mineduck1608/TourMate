using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class TourBidCreateModel
    {
        public int AccountId { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public bool IsDeleted { get; set; }

        public int PlaceRequested { get; set; }

        public string Status { get; set; }

        public string Content { get; set; }

        public float? MaxPrice { get; set; }
        public TourBid Convert() => new TourBid
        {
            AccountId = AccountId,
            CreatedAt = CreatedAt,
            UpdatedAt = UpdatedAt,
            IsDeleted = IsDeleted,
            PlaceRequested = PlaceRequested,
            TourBid1 = 0
        };
    }
}