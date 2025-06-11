using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.DTO
{
    public class FinancialStatus
    {
        public decimal TotalRevenue { get; set; }
        public decimal TourCommissionRevenue { get; set; }
        public decimal MembershipRevenue { get; set; }
        public decimal NetProfit { get; set; }
        public decimal ProfitMargin { get; set; }
        public decimal RevenueGrowth { get; set; }
        public decimal CommissionGrowth { get; set; }
        public decimal MembershipGrowth { get; set; }
    }

    public class AreaStatus
    {
        public int AreaId { get; set; }
        public string AreaName { get; set; } = string.Empty;
        public int CompletedTours { get; set; }
        public int TotalRequests { get; set; }
        public decimal AverageRating { get; set; }
        public decimal TotalRevenue { get; set; }
        public int CancelledTours { get; set; }
        public int ActiveGuides { get; set; }
    }

    public class UserStatus
    {
        public int NewUsers { get; set; }
        public int NewGuides { get; set; }
        public int TotalActiveUsers { get; set; }
        public int TotalActiveGuides { get; set; }
        public decimal UserGrowthRate { get; set; }
        public decimal GuideGrowthRate { get; set; }
    }

    public class TourPerformance
    {
        public int TourId { get; set; }
        public string TourTitle { get; set; } = string.Empty;
        public string AreaName { get; set; } = string.Empty;
        public decimal Profit { get; set; }
        public decimal AverageBids { get; set; }
        public decimal AverageRating { get; set; }
        public int CompletedCount { get; set; }
    }

    public class GuidePerformance
    {
        public int GuideId { get; set; }
        public string GuideName { get; set; } = string.Empty;
        public string AreaName { get; set; } = string.Empty;
        public decimal AverageRating { get; set; }
        public int TotalTours { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal CompletionRate { get; set; }
    }

    public class MembershipStatus
    {
        public int PackageId { get; set; }
        public string PackageName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Duration { get; set; } = string.Empty;
        public int TotalSales { get; set; }
        public decimal Revenue { get; set; }
        public decimal GrowthRate { get; set; }
        public List<string> Features { get; set; } = new List<string>();
    }

    public class AdminDashboard
    {
        public FinancialStatus Financial { get; set; } = new FinancialStatus();
        public List<AreaStatus> Areas { get; set; } = new List<AreaStatus>();
        public UserStatus Users { get; set; } = new UserStatus();
        public List<TourPerformance> TopTours { get; set; } = new List<TourPerformance>();
        public List<GuidePerformance> TopGuides { get; set; } = new List<GuidePerformance>();
        public List<AreaStatus> CancelledToursByArea { get; set; } = new List<AreaStatus>();
        public List<MembershipStatus> MembershipPackages { get; set; } = new List<MembershipStatus>();
    }

    public class DashboardFilter
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string? AreaFilter { get; set; }
    }
}
