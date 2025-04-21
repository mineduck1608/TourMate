using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class CvapplicationsCreateModel
    {
        public string FullName { get; set; }

        public DateOnly DateOfBirth { get; set; }

        public string Gender { get; set; }

        public string Address { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public string Link { get; set; }

        public string Image { get; set; }

        public string Description { get; set; }

        public string Status { get; set; }
        public Cvapplication Convert() => new()
        {
            FullName = FullName,
            DateOfBirth = DateOfBirth,
            Gender = Gender,
            Address = Address,
            Email = Email,
            Phone = Phone,
            Link = Link,
            Image = Image,
            Description = Description,
            Status = Status,
            CvApplicationId = 0
        };
    }
}