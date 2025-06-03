using Repositories.Models;

namespace Repositories.DTO.UpdateModals
{
    public class TourServiceEditModel
    {
        public int ServiceId { get; set; }

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
            Duration = Duration,
            Image = Image,
            Price = Price,
            TourDesc = TourDesc,
            ServiceId = ServiceId,
            Title = Title,
            ServiceName = ServiceName,           
        };
    }
}