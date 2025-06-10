using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface IMembershipPackagesService
    {
        Task<MembershipPackage> GetMembershipPackages(int id);
        IEnumerable<MembershipPackage> GetAll(int pageSize, int pageIndex);
        void CreateMembershipPackages(MembershipPackage membershippackages);
        void UpdateMembershipPackages(MembershipPackage membershippackages);
        bool DeleteMembershipPackages(int id);
    }

    public class MembershipPackagesService : IMembershipPackagesService
    {
        private MembershipPackagesRepository MembershipPackagesRepository { get; set; } = new();

        public async Task<MembershipPackage> GetMembershipPackages(int id)
        {
            return await MembershipPackagesRepository.GetByIdAsync(id);
        }

        public IEnumerable<MembershipPackage> GetAll(int pageSize, int pageIndex)
        {
            return MembershipPackagesRepository.GetAll(pageSize, pageIndex);
        }

        public void CreateMembershipPackages(MembershipPackage membershippackages)
        {
            MembershipPackagesRepository.Create(membershippackages);
        }

        public void UpdateMembershipPackages(MembershipPackage membershippackages)
        {
            MembershipPackagesRepository.Update(membershippackages);
        }

        public bool DeleteMembershipPackages(int id)
        {
            MembershipPackagesRepository.Remove(id);
            return true;
        }
    }
}