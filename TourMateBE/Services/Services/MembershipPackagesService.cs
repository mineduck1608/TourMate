using Repositories.Models;
using Repositories.IRepositories;
using Services.IServices;

namespace Services.Services
{
    public class MembershipPackagesService : IMembershipPackagesService
    {
        private IMembershipPackagesRepository MembershipPackagesRepository;

        public MembershipPackagesService(IMembershipPackagesRepository membershipPackagesRepository)
        {
            MembershipPackagesRepository = membershipPackagesRepository ?? throw new ArgumentNullException(nameof(membershipPackagesRepository));
        }

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

        public async Task<MembershipPackage> GetNearestPackageForAccount(int id)
        {
            return await MembershipPackagesRepository.GetNearestPackageForAccount(id);
        }
    }
}