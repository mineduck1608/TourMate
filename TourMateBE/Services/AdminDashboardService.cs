using Microsoft.Extensions.Logging;
using Repositories.DTO;
using Repositories.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public interface IAdminDashboardService
    {
        Task<AdminDashboard> GetDashboardDataAsync(DashboardFilter filter);
        Task<FinancialStatus> GetFinancialStatsAsync(DashboardFilter filter);
        Task<List<AreaStatus>> GetAreaStatsAsync(DashboardFilter filter);
        Task<UserStatus> GetUserStatsAsync(DashboardFilter filter);
        Task<List<TourPerformance>> GetTopToursAsync(DashboardFilter filter, int limit = 10);
        Task<List<GuidePerformance>> GetTopGuidesAsync(DashboardFilter filter, int limit = 10);
        Task<List<MembershipStatus>> GetMembershipStatsAsync(DashboardFilter filter);
        Task<List<AreaStatus>> GetCancelledToursByAreaAsync(DashboardFilter filter);
    }   
    public class AdminDashboardService : IAdminDashboardService
    {
        private readonly AdminDashboardRepository _dashboardRepository;
        private readonly ILogger<AdminDashboardService> _logger;

        public AdminDashboardService(
            AdminDashboardRepository dashboardRepository,
            ILogger<AdminDashboardService> logger)
        {
            _dashboardRepository = dashboardRepository;
            _logger = logger;
        }

        public async Task<AdminDashboard> GetDashboardDataAsync(DashboardFilter filter)
        {
            try
            {
                _logger.LogInformation("Fetching dashboard data with filters: {@Filter}", filter);

                var financial = await GetFinancialStatsAsync(filter);
                var area = await GetAreaStatsAsync(filter);
                var user = await GetUserStatsAsync(filter);
                var topTours = await GetTopToursAsync(filter);
                var topGuides = await GetTopGuidesAsync(filter);
                var membership = await GetMembershipStatsAsync(filter);
                var cancelled = await GetCancelledToursByAreaAsync(filter);

                var dashboardData = new AdminDashboard
                {
                    Financial = financial ?? new FinancialStatus(),
                    Areas = area ?? new List<AreaStatus>(),
                    Users = user ?? new UserStatus(),
                    TopTours = topTours ?? new List<TourPerformance>(),
                    TopGuides = topGuides ?? new List<GuidePerformance>(),
                    MembershipPackages = membership ?? new List<MembershipStatus>(),
                    CancelledToursByArea = cancelled ?? new List<AreaStatus>()
                };


                _logger.LogInformation("Successfully fetched dashboard data");
                return dashboardData;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching dashboard data");
                throw;
            }
        }


        public async Task<FinancialStatus> GetFinancialStatsAsync(DashboardFilter filter)
        {
            return await _dashboardRepository.GetFinancialStatsAsync(
                filter.FromDate,
                filter.ToDate,
                filter.AreaFilter);
        }

        public async Task<List<AreaStatus>> GetAreaStatsAsync(DashboardFilter filter)
        {
            return await _dashboardRepository.GetAreaStatsAsync(
                filter.FromDate,
                filter.ToDate);
        }

        public async Task<UserStatus> GetUserStatsAsync(DashboardFilter filter)
        {
            return await _dashboardRepository.GetUserStatsAsync(
                filter.FromDate,
                filter.ToDate);
        }

        public async Task<List<TourPerformance>> GetTopToursAsync(DashboardFilter filter, int limit = 10)
        {
            return await _dashboardRepository.GetTopToursAsync(
                filter.FromDate,
                filter.ToDate,
                filter.AreaFilter,
                limit);
        }

        public async Task<List<GuidePerformance>> GetTopGuidesAsync(DashboardFilter filter, int limit = 10)
        {
            return await _dashboardRepository.GetTopGuidesAsync(
                filter.FromDate,
                filter.ToDate,
                filter.AreaFilter,
                limit);
        }

        public async Task<List<MembershipStatus>> GetMembershipStatsAsync(DashboardFilter filter)
        {
            return await _dashboardRepository.GetMembershipStatsAsync(
                filter.FromDate,
                filter.ToDate);
        }

        public async Task<List<AreaStatus>> GetCancelledToursByAreaAsync(DashboardFilter filter)
        {
            return await _dashboardRepository.GetCancelledToursByAreaAsync(
                filter.FromDate,
                filter.ToDate);
        }
    }
}
