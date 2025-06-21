using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface ITourGuideDescService
    {
        TourGuideDesc GetTourGuideDesc(int id);
        IEnumerable<TourGuideDesc> GetAll(int pageSize, int pageIndex);
        Task<bool> CreateTourGuideDesc(TourGuideDesc tourguidedesc);
        void UpdateTourGuideDesc(TourGuideDesc tourguidedesc);
        bool DeleteTourGuideDesc(int id);
    }
}
