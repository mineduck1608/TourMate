using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class TourGuideRevenueCreateModel
    {
        public int? TourGuideRevenue1 { get; set; }

        public int PaymentId { get; set; }

        public float Value { get; set; }

        public int TourGuideId { get; set; }
        public TourGuideRevenue Convert() => new()
        {
            TourGuideId = TourGuideId,
            TourGuideRevenue1 = TourGuideRevenue1 ?? 0,
            Value = Value,
            PaymentId = PaymentId
        };
    }
}