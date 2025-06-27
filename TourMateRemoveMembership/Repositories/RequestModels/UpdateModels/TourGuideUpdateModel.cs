using Repositories.Models;

namespace Repositories.DTO.UpdateModels
{
    public class TourGuideUpdateModel
    {
        public int TourGuideId { get; set; }
        public string FullName { get; set; }

        public string Gender { get; set; }

        public DateOnly DateOfBirth { get; set; }

        public string Address { get; set; }

        public string Image { get; set; }

        public string Phone { get; set; }
        public string Description { get; set; }
        public int? YearOfExperience { get; set; }
        public int AreaId { get; set; }
        public string Company { get; set; }
        public int AccountId { get; set; }
        public string BannerImage { get; set; }
        public TourGuide Convert() => new()
        {
            TourGuideId = TourGuideId,
            FullName = FullName,
            Gender = Gender,
            DateOfBirth = DateOfBirth,
            Address = Address,
            Image = Image,
            Phone = Phone,
            AccountId = AccountId,
            BannerImage = BannerImage,
            TourGuideDescs = [
                new(){
                    AreaId = AreaId,
                    Company = Company,
                    Description = Description,
                    YearOfExperience = YearOfExperience,
                    TourGuideId = TourGuideId,
                    }
                ]
        };
    }
}