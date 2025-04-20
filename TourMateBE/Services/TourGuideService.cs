using Repositories.Models;
using Repositories.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
        public interface ITourGuideService
        {
            Task<TourGuide> GetTourGuideByAccId(int accId);

        }
        public class TourGuideService : ITourGuideService
        {
            private readonly TourGuideRepository _repository;

            public TourGuideService(TourGuideRepository repository)
            {
                _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            }

            public async Task<TourGuide> GetTourGuideByAccId(int accId)
            {
                return await _repository.GetByAccId(accId);
            }
        }
}
