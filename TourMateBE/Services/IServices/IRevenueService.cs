using Repositories.DTO;
using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface IRevenueService
    {
        Task<bool> CreateRevenue(Revenue revenue);
        Task<RevenueStatsDto> GetRevenueStatsAsync(int tourGuideId, int month, int year);
        Task<MonthlyRevenueDto> GetMonthlyRevenueAsync(int tourGuideId, int month, int year);
        Task<IEnumerable<RevenueDto>> GetRevenueListAsync(RevenueFilterDto filter);
        Task<RevenueDto?> GetRevenueByIdAsync(int revenueId);
        Task<RevenueDto> CreateRevenueAsync(RevenueDto revenueDto);
        Task<RevenueDto> UpdateRevenueAsync(int revenueId, RevenueDto revenueDto);
        Task<bool> DeleteRevenueAsync(int revenueId);
        Task<decimal> CalculateGrowthPercentageAsync(int tourGuideId, int month, int year);
    }
}
