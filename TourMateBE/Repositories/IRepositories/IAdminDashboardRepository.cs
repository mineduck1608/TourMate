using Repositories.ResponseModels;

namespace Repositories.IRepositories
{
    public interface IAdminDashboardRepository
    {
        Task<FinancialStatus> GetFinancialStatsAsync(DateTime? fromDate, DateTime? toDate, string? areaFilter);
        Task<List<AreaStatus>> GetAreaStatsAsync(DateTime? fromDate, DateTime? toDate, int limit);
        Task<UserStatus> GetUserStatsAsync(DateTime? fromDate, DateTime? toDate);
        Task<List<TourPerformance>> GetTopToursAsync(DateTime? fromDate, DateTime? toDate, string? areaFilter, int limit = 10);
        Task<List<GuidePerformance>> GetTopGuidesAsync(DateTime? fromDate, DateTime? toDate, string? areaFilter, int limit = 10);
        Task<List<AreaStatus>> GetCancelledToursByAreaAsync(DateTime? fromDate, DateTime? toDate, int limit = 10);
        Task<List<MembershipStatus>> GetMembershipStatsAsync(DateTime? fromDate, DateTime? toDate);
    }
}
