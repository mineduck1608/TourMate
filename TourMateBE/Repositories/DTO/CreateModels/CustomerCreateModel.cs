using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class CustomerCreateModel
    {
        public int CustomerId { get; set; }

        public string FullName { get; set; }

        public int AccountId { get; set; }

        public string Gender { get; set; }

        public DateOnly DateOfBirth { get; set; }

        public string Phone { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public DateTime CreatedAt { get; set; }

        public int RoleID { get; set; }

        public bool Status { get; set; }

        public Customer ConvertCustomer() => new()
        {
            FullName = FullName,
            AccountId = AccountId,
            Gender = Gender,
            Phone = Phone,
            CustomerId = 0,
            DateOfBirth = DateOfBirth,
        };

        public Account ConvertAccount() => new()
        {
            Email = Email,
            Password = Password,
            CreatedDate = CreatedAt,
            RoleId = 2,
            Status = true
        };
    }
}