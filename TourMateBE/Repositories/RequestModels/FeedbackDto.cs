using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.RequestModels
{
        public class TourFeedbackDto
        {
            public int FeedbackId { get; set; }
            public int CustomerId { get; set; }
            public string CustomerName { get; set; } = null!;
            public int TourGuideId { get; set; }
            public string TourGuideName { get; set; } = null!;
            public string TourName { get; set; } = null!;
            public string Content { get; set; } = null!;
            public int Rating { get; set; }
            public DateTime CreatedDate { get; set; }
            public DateTime UpdatedAt { get; set; }
            public int? InvoiceId { get; set; }
            public bool IsDeleted { get; set; }
        }

        public class PlatformFeedbackDto
        {
            public int FeedbackId { get; set; }
            public int AccountId { get; set; }
            public string AccountName { get; set; } = null!;
            public int PaymentId { get; set; }
            public int Rating { get; set; }
            public string? Content { get; set; }
            public DateTime? CreatedAt { get; set; }
        }

        public class FeedbackStatsDto
        {
            public int TotalFeedbacks { get; set; }
            public decimal AverageRating { get; set; }
            public List<RatingDistributionDto> RatingDistribution { get; set; } = new List<RatingDistributionDto>();
        }

        public class RatingDistributionDto
        {
            public int Rating { get; set; }
            public int Count { get; set; }
            public decimal Percentage { get; set; }
        }

        public class TopTourGuideDto
        {
            public int TourGuideId { get; set; }
            public string Name { get; set; } = null!;
            public decimal AverageRating { get; set; }
            public int TotalReviews { get; set; }
        }

        public class CreateTourFeedbackDto
        {
            public int CustomerId { get; set; }
            public int TourGuideId { get; set; }
            public int? InvoiceId { get; set; }
            public string Content { get; set; } = null!;
            public int Rating { get; set; }
        }

        public class CreatePlatformFeedbackDto
        {
            public int AccountId { get; set; }
            public int PaymentId { get; set; }
            public int Rating { get; set; }
            public string? Content { get; set; }
        }
}
