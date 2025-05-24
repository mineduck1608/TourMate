using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class TourGuideUpdateModel
    {
        public int TourGuideId { get; set; }
        public string FullName { get; set; }

        public string Gender { get; set; }

        public DateOnly DateOfBirth { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        public string Address { get; set; }

        public string Image { get; set; }

        public string Phone { get; set; }
        public string Description { get; set; }
        public int? YearOfExperience { get; set; }
        public int AreaId { get; set; }
        public string Company { get; set; }
        public int AccountId { get; set; }
        public TourGuide Convert() => new()
        {
            FullName = FullName,
            Gender = Gender,
            DateOfBirth = DateOfBirth,
            Address = Address,
            Image = Image,
            Phone = Phone,
            TourGuideId = TourGuideId,
            Account = new()
            {
                Email = Email,
                Password = Password,
                AccountId = AccountId,
            },
            TourGuideDescs = [
                new(){
                    AreaId = AreaId,
                    Company = Company,
                    Description = Description,
                    YearOfExperience = YearOfExperience,
                }
                ]
        };
    }
}