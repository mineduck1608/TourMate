using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface ICvapplicationService
    {
        Cvapplication GetCvapplication(int id);
        IEnumerable<Cvapplication> GetAll(int pageSize, int pageIndex);
        void CreateCvapplication(Cvapplication cvapplication);
        void UpdateCvapplication(Cvapplication cvapplication);
        bool DeleteCvapplication(int id);
    }

    public class CvapplicationService : ICvapplicationService
    {
        private CvapplicationRepository CvapplicationRepository { get; set; } = new();

        public Cvapplication GetCvapplication(int id)
        {
            return CvapplicationRepository.GetById(id);
        }

        public IEnumerable<Cvapplication> GetAll(int pageSize, int pageIndex)
        {
            return CvapplicationRepository.GetAll(pageSize, pageIndex);
        }

        public void CreateCvapplication(Cvapplication cvapplication)
        {
            CvapplicationRepository.Create(cvapplication);
        }

        public void UpdateCvapplication(Cvapplication cvapplication)
        {
            CvapplicationRepository.Update(cvapplication);
        }

        public bool DeleteCvapplication(int id)
        {
            CvapplicationRepository.Remove(id);
            return true;
        }
    }
}