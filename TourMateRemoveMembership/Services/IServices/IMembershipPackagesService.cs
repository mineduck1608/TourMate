using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface IMembershipPackagesService
    {
        Task<MembershipPackage> GetMembershipPackages(int id);
        IEnumerable<MembershipPackage> GetAll(int pageSize, int pageIndex);
        void CreateMembershipPackages(MembershipPackage membershippackages);
        void UpdateMembershipPackages(MembershipPackage membershippackages);
        bool DeleteMembershipPackages(int id);
        Task<MembershipPackage> GetNearestPackageForAccount(int id);
    }
}
