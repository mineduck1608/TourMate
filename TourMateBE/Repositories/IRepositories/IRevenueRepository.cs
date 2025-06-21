using Repositories.DTO;
using Repositories.GenericRepository;
using Repositories.Models;

namespace Repositories.IRepositories
{
    public interface IRevenueRepository : IGenericRepository<Revenue>
    {
        Task<IEnumerable<Revenue>> GetAllRevenuesAsync();
        Task<Revenue?> GetRevenueByIdAsync(int revenueId);
        Task<IEnumerable<Revenue>> GetRevenuesByTourGuideAsync(int tourGuideId);
        Task<IEnumerable<Revenue>> GetRevenuesByMonthAsync(int tourGuideId, int month, int year);
        Task<MonthlyRevenueDto> GetMonthlyStatsAsync(int tourGuideId, int month, int year);
        Task<IEnumerable<Revenue>> GetRevenuesWithFilterAsync(RevenueFilterDto filter);
        Task<int> GetTotalRevenueCountAsync(RevenueFilterDto filter);
        Task<decimal> GetTotalRevenueAmountAsync(int tourGuideId, int month, int year);
        Task<decimal> GetPreviousMonthRevenueAsync(int tourGuideId, int month, int year);
        Task<Revenue> CreateRevenueAsync(Revenue revenue);
        Task<Revenue> UpdateRevenueAsync(Revenue revenue);
        Task<bool> DeleteRevenueAsync(int revenueId);
    }
}
