using Repositories.Models;
using Repositories.IRepositories;
using Repositories.ResponseModels;
using Services.IServices;

namespace Services.Services
{
    public class CvapplicationService : ICvapplicationService
    {
        private ICvapplicationRepository CvapplicationRepository;

        public CvapplicationService(ICvapplicationRepository cvapplicationRepository)
        {
            CvapplicationRepository = cvapplicationRepository ?? throw new ArgumentNullException(nameof(cvapplicationRepository));
        }

        public async Task<Cvapplication> GetCvapplication(int id)
        {
            return await CvapplicationRepository.GetByIdAsync(id);
        }

        public async Task<PagedResult<Cvapplication>> GetAll(int pageSize, int pageIndex)
        {
            return await CvapplicationRepository.GetAllPaged(pageSize, pageIndex);
        }

        public async Task<bool> CreateCvapplication(Cvapplication cvapplication)
        {
            return await CvapplicationRepository.CreateAsync(cvapplication);
        }

        public async Task<bool> UpdateCvapplication(Cvapplication cvapplication)
        {
            return await CvapplicationRepository.UpdateAsync(cvapplication);
        }

        public bool DeleteCvapplication(int id)
        {
            CvapplicationRepository.Remove(id);
            return true;
        }
    }
}