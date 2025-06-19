using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class TourGuideDescCreateModel
    {
        public int? TourGuideDescId { get; set; }

        public int TourGuideId { get; set; }

        public int? YearOfExperience { get; set; }

        public string Description { get; set; }

        public int AreaId { get; set; }

        public string Company { get; set; }
        public TourGuideDesc Convert() => new()
        {
            TourGuideId = TourGuideId,
            TourGuideDescId = TourGuideDescId ?? 0,
            YearOfExperience = YearOfExperience,
            Description = Description,
            AreaId = AreaId,
            Company = Company
        };
    }
}