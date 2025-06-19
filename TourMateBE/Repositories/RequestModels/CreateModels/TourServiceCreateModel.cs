using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class TourServiceCreateModel
    {
        public string ServiceName { get; set; }

        public float Price { get; set; }

        public TimeOnly Duration { get; set; }

        public string Content { get; set; }

        public string Image { get; set; }

        public int TourGuideId { get; set; }
        public string Title { get; set; }
        public string TourDesc { get; set; }
        public TourService Convert() => new()
        {
            TourGuideId = TourGuideId,
            Content = Content,
            CreatedDate = DateOnly.FromDateTime(DateTime.Now),
            IsDeleted = false,            
            Duration = Duration,
            Image = Image,
            Price = Price,
            ServiceName = ServiceName,
            Title = Title,
            TourDesc = TourDesc
        };
    }
}