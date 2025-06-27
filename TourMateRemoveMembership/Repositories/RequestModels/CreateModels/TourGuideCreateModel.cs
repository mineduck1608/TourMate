using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class TourGuideCreateModel
    {
        public string FullName { get; set; }

        public string Gender { get; set; }

        public DateOnly DateOfBirth { get; set; }

        public int AccountId { get; set; }

        public string Address { get; set; }

        public string Image { get; set; }

        public string Phone { get; set; }
        public TourGuide Convert() => new()
        {
            FullName = FullName,
            Gender = Gender,
            DateOfBirth = DateOfBirth,
            AccountId = AccountId,
            Address = Address,
            Image = Image,
            Phone = Phone,
            TourGuideId = 0,
            
        };
    }
}