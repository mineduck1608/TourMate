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

    public class ProcessPaymentRequest
    {
        public List<int> RevenueIds { get; set; } = new();
        public int AdminId { get; set; }
    }

    public class PaymentResultAdmin
    {
        public bool Success { get; set; }
        public int PaymentId { get; set; }
        public decimal TotalAmount { get; set; }
        public int ProcessedCount { get; set; }
        public string Message { get; set; } = string.Empty;
    }

    public class PaymentHistoryAdmin
    {
        public int Id { get; set; }
        public string TourGuideName { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string PaymentDate { get; set; } = string.Empty; // Changed from DateTime to string
        public string PaymentMethod { get; set; } = string.Empty;
        public string BankName { get; set; } = string.Empty;
        public string AccountNumber { get; set; } = string.Empty;
        public int ToursCount { get; set; }
    }

    public class RevenueAdmin
    {
        public int RevenueId { get; set; }
        public int TourGuideId { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal ActualReceived { get; set; }
        public decimal PlatformCommission { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool PaymentStatus { get; set; }
        public int? InvoiceId { get; set; }
        public InvoiceAdmin? Invoice { get; set; }
        public TourGuideAdmin TourGuide { get; set; } = null!;
    }

    public class InvoiceAdmin
    {
        public int InvoiceId { get; set; }
        public string TourName { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class TourGuideAdmin
    {
        public int TourGuideId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string BankAccountNumber { get; set; } = string.Empty;
        public string BankName { get; set; } = string.Empty;
    }

    public class DashboardStatsAdmin
    {
        public decimal TotalUnpaidAmount { get; set; }
        public int TotalUnpaidCount { get; set; }
        public decimal TotalPaidThisMonth { get; set; }
        public int TotalPaidCountThisMonth { get; set; }
        public int TotalTourGuidesWithUnpaidRevenues { get; set; }
    }
}
