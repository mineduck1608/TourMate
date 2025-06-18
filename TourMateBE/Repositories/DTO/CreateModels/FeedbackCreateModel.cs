using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class FeedbackCreateModel
    {
        public int CustomerId { get; set; }

        public int TourGuideId { get; set; }

        public string Content { get; set; }

        public int Rating { get; set; }
        public int InvoiceId { get; set; }

        public Feedback Convert() => new()
        {
            FeedbackId = 0,
            CustomerId = CustomerId,
            TourGuideId = TourGuideId,
            CreatedDate = DateTime.Now,
            Content = Content,
            Rating = Rating,
            IsDeleted = false,
            UpdatedAt = DateTime.Now,
            InvoiceId = InvoiceId
        };
    }
}