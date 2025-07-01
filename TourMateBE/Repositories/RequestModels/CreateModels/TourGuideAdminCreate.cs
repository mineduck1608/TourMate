using Repositories.DTO.CreateModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.RequestModels.CreateModels
{
    public class TourGuideAdminCreate
    {
        public string FullName { get; set; } = null!;
        public string Gender { get; set; } = null!;
        public DateOnly DateOfBirth { get; set; }
        public string Address { get; set; } = null!;
        public string Image { get; set; } = null!;
        public string BannerImage { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public bool IsVerified { get; set; }
        public AccountAdminCreate Account { get; set; } = null!;
        public List<TourGuideDescAdminCreate> TourGuideDescs { get; set; } = new();
    }

    public class AccountAdminCreate
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class TourGuideDescAdminCreate
    {
        public int? YearOfExperience { get; set; }
        public string Description { get; set; } = "";
        public int AreaId { get; set; }
        public string? Company { get; set; }
    }

}
