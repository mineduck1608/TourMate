using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class TourServiceCreateModel
    {
        public int? ServiceId { get; set; }

        public string ServiceName { get; set; }

        public float Price { get; set; }

        public TimeOnly Duration { get; set; }

        public string Content { get; set; }

        public string Image { get; set; }

        public int TourGuideId { get; set; }

        public DateOnly CreatedDate { get; set; }

        public bool IsDeleted { get; set; }
        public string Title { get; set; }
        public TourService Convert() => new()
        {
            TourGuideId = TourGuideId,
            Content = Content,
            CreatedDate = CreatedDate,
            IsDeleted = IsDeleted,
            Duration = Duration,
            Image = Image,
            Price = Price,
            ServiceId = ServiceId ?? 0,
            Title = Title
        };
    }
}