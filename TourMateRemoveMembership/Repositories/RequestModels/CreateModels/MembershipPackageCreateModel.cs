using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class MembershipPackageCreateModel
    {

        public string Name { get; set; }

        public float Price { get; set; }

        /// <summary>
        /// in day
        /// </summary>
        public int Duration { get; set; }

        public string BenefitDesc { get; set; }
        public MembershipPackage Convert() => new()
        {
            Name = Name,
            Price = Price,
            Duration = Duration,
            BenefitDesc = BenefitDesc,
            MembershipPackageId = 0,
        };

    }
}