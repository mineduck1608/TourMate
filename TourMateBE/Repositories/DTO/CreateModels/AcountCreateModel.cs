using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class AcountCreateModel
    {

        public string Email { get; set; }

        public string Password { get; set; }

        public DateTime CreatedDate { get; set; }

        public int RoleId { get; set; }

        public bool Status { get; set; }
        public Account Convert() => new()
        {
            Email = Email,
            Password = Password,
            CreatedDate = CreatedDate,
            RoleId = RoleId,
            AccountId = 0,
            Status = Status,
        };
    }
}