using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class TourGuideAdminUpdateModel
    {
        public int TourGuideId { get; set; }
        public int AccountId { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string Password { get; set; }
        public string Phone { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string Gender { get; set; }
    }
}