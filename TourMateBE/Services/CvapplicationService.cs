using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface ICvapplicationService
    {
        Task<Cvapplication> GetCvapplication(int id);
        IEnumerable<Cvapplication> GetAll(int pageSize, int pageIndex);
        Task<bool> CreateCvapplication(Cvapplication cvapplication);
        Task<bool> UpdateCvapplication(Cvapplication cvapplication);
        bool DeleteCvapplication(int id);
    }

    public class CvapplicationService : ICvapplicationService
    {
        private CvapplicationRepository CvapplicationRepository { get; set; } = new();

        public async Task<Cvapplication> GetCvapplication(int id)
        {
            return await CvapplicationRepository.GetByIdAsync(id);
        }

        public IEnumerable<Cvapplication> GetAll(int pageSize, int pageIndex)
        {
            return CvapplicationRepository.GetAll(pageSize, pageIndex);
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