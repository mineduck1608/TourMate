using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface ITourGuideRevenueService
    {
        TourGuideRevenue GetTourGuideRevenue(int id);
        IEnumerable<TourGuideRevenue> GetAll(int pageSize, int pageIndex);
        void CreateTourGuideRevenue(TourGuideRevenue tourguiderevenue);
        void UpdateTourGuideRevenue(TourGuideRevenue tourguiderevenue);
        bool DeleteTourGuideRevenue(int id);
    }

}
