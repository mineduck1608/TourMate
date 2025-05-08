using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class CustomerCreateModel
    {
        public string FullName { get; set; }

        public int AccountId { get; set; }

        public string Gender { get; set; }

        public DateOnly DateOfBirth { get; set; }


        public string Phone { get; set; }
        public Customer Convert() => new()
        {
            FullName = FullName,
            AccountId = AccountId,
            Gender = Gender,
            Phone = Phone,
            CustomerId = 0,
            DateOfBirth = DateOfBirth,
        };
    }
}