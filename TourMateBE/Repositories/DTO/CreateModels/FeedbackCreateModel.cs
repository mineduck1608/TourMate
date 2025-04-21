using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class FeedbackCreateModel
    {
        public int? FeedbackId { get; set; }

        public int CustomerId { get; set; }

        public int TourGuideId { get; set; }

        public DateTime CreatedDate { get; set; }

        public string Content { get; set; }

        public int Rating { get; set; }

        public bool IsDeleted { get; set; }

        public DateTime UpdatedAt { get; set; }
        public Feedback Convert() => new()
        {
            FeedbackId = FeedbackId ?? 0,
            CustomerId = CustomerId,
            TourGuideId = TourGuideId,
            CreatedDate = CreatedDate,
            Content = Content,
            Rating = Rating,
            IsDeleted = IsDeleted,
            UpdatedAt = UpdatedAt
        };
    }
}