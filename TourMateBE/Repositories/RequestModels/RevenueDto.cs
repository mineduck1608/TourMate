using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.DTO
{
    public class RevenueDto
    {
        public int RevenueId { get; set; }
        public int TourGuideId { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal ActualReceived { get; set; }
        public decimal PlatformCommission { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool PaymentStatus { get; set; }
        public string TourGuideName { get; set; }
    }

    public class MonthlyRevenueDto
    {
        public int Month { get; set; }
        public int Year { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal PlatformFee { get; set; }
        public decimal NetRevenue { get; set; }
        public int TotalRecords { get; set; }
        public int CompletedPayments { get; set; }
        public int PendingPayments { get; set; }
        public decimal GrowthPercentage { get; set; }
    }

    public class RevenueStatsDto
    {
        public decimal TotalRevenue { get; set; }
        public decimal PlatformFee { get; set; }
        public decimal NetRevenue { get; set; }
        public int TotalRecords { get; set; }
        public int CompletedPayments { get; set; }
        public int PendingPayments { get; set; }
        public decimal MonthlyGrowth { get; set; }
        public List<RevenueDto> RevenueList { get; set; } = new List<RevenueDto>();
    }

    public class RevenueFilterDto
    {
        public int TourGuideId { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public bool? PaymentStatus { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
