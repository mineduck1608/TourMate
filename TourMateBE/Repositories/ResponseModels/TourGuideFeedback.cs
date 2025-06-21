using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.ResponseModels
{
        public class PublicFeedbackDto
        {
            public int FeedbackId { get; set; }
            public int CustomerId { get; set; }
            public int TourGuideId { get; set; }
            public DateTime CreatedDate { get; set; }
            public string Content { get; set; } = string.Empty;
            public int Rating { get; set; }
            public int InvoiceId { get; set; }
            public string? CustomerName { get; set; }
            public string? CustomerAvatar { get; set; }
            public int? CustomerAccountId { get; set; }
            public string? TourName { get; set; }
            public DateTime? StartDate { get; set; }
        }

        public class PaginatedFeedbackResponse
        {
            public List<PublicFeedbackDto> Result { get; set; } = new();
            public int TotalCount { get; set; }
            public int TotalPage { get; set; }
            public int CurrentPage { get; set; }
            public int PageSize { get; set; }
        }

    public class TourGuideFeedback
    {
        public int FeedbackId { get; set; }
        public int CustomerAccountId { get; set; }
        public string CustomerName { get; set; }
        public int Rating { get; set; }
        public string Content { get; set; }
        public string CreatedAt { get; set; }
    }
}
