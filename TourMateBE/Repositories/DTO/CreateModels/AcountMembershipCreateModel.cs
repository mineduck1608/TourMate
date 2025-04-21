using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class AcountMembershipCreateModel
    {

        public int AccountId { get; set; }

        public int MembershipPackageId { get; set; }

        public DateOnly StartDate { get; set; }

        public DateOnly EndDate { get; set; }

        public bool IsActive { get; set; }
        public AccountMembership Convert() => new()
        {
            AccountId = AccountId,
            AccountMembershipId = 0,
            EndDate = EndDate,
            IsActive = IsActive,
            StartDate = StartDate,
        };
    }
}