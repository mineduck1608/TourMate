using Repositories.ResponseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface IAdminDashboardService
    {
        Task<AdminDashboard> GetDashboardDataAsync(DashboardFilter filter);
        Task<FinancialStatus> GetFinancialStatsAsync(DashboardFilter filter);
        Task<List<AreaStatus>> GetAreaStatsAsync(DashboardFilter filter, int limit = 10);
        Task<UserStatus> GetUserStatsAsync(DashboardFilter filter);
        Task<List<TourPerformance>> GetTopToursAsync(DashboardFilter filter, int limit = 10);
        Task<List<GuidePerformance>> GetTopGuidesAsync(DashboardFilter filter, int limit = 10);
        Task<List<MembershipStatus>> GetMembershipStatsAsync(DashboardFilter filter);
        Task<List<AreaStatus>> GetCancelledToursByAreaAsync(DashboardFilter filter);
    }
}
