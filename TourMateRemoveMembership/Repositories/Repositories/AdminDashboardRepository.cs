using Microsoft.EntityFrameworkCore;
using Repositories.Context;
using Repositories.IRepositories;
using Repositories.Models;
using Repositories.ResponseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Repositories.Repositories
{
    public class AdminDashboardRepository : IAdminDashboardRepository
    {
        private readonly TourmateContext _context;

        public AdminDashboardRepository(TourmateContext context)
        {
            _context = context;
        }

        public async Task<FinancialStatus> GetFinancialStatsAsync(DateTime? fromDate, DateTime? toDate, string? areaFilter)
        {
            var revenueQuery = _context.Revenues.AsQueryable();
            var membershipQuery = _context.Payments.Include(p => p.MembershipPackage)
                .Where(p => p.MembershipPackageId != null);
                

            // Apply date filters
            if (fromDate.HasValue)
            {
                revenueQuery = revenueQuery.Where(r => r.CreatedAt >= fromDate.Value);
                membershipQuery = membershipQuery.Where(m => m.CreatedAt >= fromDate.Value);
            }

            if (toDate.HasValue)
            {
                revenueQuery = revenueQuery.Where(r => r.CreatedAt <= toDate.Value);
                membershipQuery = membershipQuery.Where(m => m.CreatedAt <= toDate.Value);
            }

            // Apply area filter for tour commissions
            if (!string.IsNullOrEmpty(areaFilter) && areaFilter != "all")
            {
                revenueQuery = revenueQuery.Include(r => r.TourGuide)
                    .ThenInclude(tg => tg.TourGuideDescs)
                        .ThenInclude(desc => desc.Area)
                    .Where(r => r.TourGuide.TourGuideDescs
                        .Any(desc => desc.Area.AreaName.ToLower() == areaFilter.ToLower()));
            }

            // Calculate current period stats
            var tourCommissionRevenue = await revenueQuery.SumAsync(r => r.PlatformCommission);
            var membershipRevenue = await membershipQuery.SumAsync(m => m.Price);
            var totalRevenue = tourCommissionRevenue + (decimal)membershipRevenue;

            // Calculate previous period for growth comparison
            var periodDays = (toDate ?? DateTime.UtcNow) - (fromDate ?? DateTime.UtcNow.AddMonths(-3));
            var previousFromDate = (fromDate ?? DateTime.UtcNow.AddMonths(-3)) - periodDays;
            var previousToDate = fromDate ?? DateTime.UtcNow.AddMonths(-3);

            var prevTourCommission = await _context.Revenues
                .Where(r => r.CreatedAt >= previousFromDate && r.CreatedAt <= previousToDate)
                .SumAsync(r => r.PlatformCommission);

            var prevMembershipRevenue = await _context.Payments
                .Where(m => m.MembershipPackageId != null && m.CreatedAt >= previousFromDate && m.CreatedAt <= previousToDate)
                .SumAsync(m => m.Price);

            var prevTotalRevenue = prevTourCommission + (decimal)prevMembershipRevenue;

            // Calculate growth rates
            var revenueGrowth = prevTotalRevenue > 0 ? ((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100 : 0;
            var commissionGrowth = prevTourCommission > 0 ? ((tourCommissionRevenue - prevTourCommission) / prevTourCommission) * 100 : 0;
            var membershipGrowth = prevMembershipRevenue > 0 ? ((membershipRevenue - prevMembershipRevenue) / prevMembershipRevenue) * 100 : 0;

            // Assume 20% operational costs for net profit calculation
            var netProfit = totalRevenue * 0.8m;
            var profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

            return new FinancialStatus
            {
                TotalRevenue = totalRevenue,
                TourCommissionRevenue = tourCommissionRevenue,
                MembershipRevenue = (decimal)membershipRevenue,
                NetProfit = netProfit,
                ProfitMargin = profitMargin,
                RevenueGrowth = revenueGrowth,
                CommissionGrowth = commissionGrowth,
                MembershipGrowth = (decimal)membershipGrowth
            };
        }

        public async Task<List<AreaStatus>> GetAreaStatsAsync(DateTime? fromDate, DateTime? toDate, int limit)
        {
            var invoicesQuery = _context.Invoices.AsQueryable();
            var revenuesQuery = _context.Revenues.AsQueryable();
            var feedbacksQuery = _context.Feedbacks.AsQueryable();

            if (fromDate.HasValue)
            {
                invoicesQuery = invoicesQuery.Where(i => i.CreatedDate >= fromDate.Value);
                revenuesQuery = revenuesQuery.Where(r => r.CreatedAt >= fromDate.Value);
            }

            if (toDate.HasValue)
            {
                invoicesQuery = invoicesQuery.Where(i => i.CreatedDate <= toDate.Value);
                revenuesQuery = revenuesQuery.Where(r => r.CreatedAt <= toDate.Value);
            }

            var query = from area in _context.ActiveAreas
                        join desc in _context.TourGuideDescs on area.AreaId equals desc.AreaId
                        join tg in _context.TourGuides on desc.TourGuideId equals tg.TourGuideId
                        group new { area, tg } by new { area.AreaId, area.AreaName } into g

                        select new AreaStatus
                        {
                            AreaId = g.Key.AreaId,
                            AreaName = g.Key.AreaName,
                            ActiveGuides = g.Select(x => x.tg.TourGuideId).Distinct().Count(),

                            // Tính toán phụ thuộc vào các ID hướng dẫn viên
                            CompletedTours = invoicesQuery
                                .Where(i => g.Select(x => x.tg.TourGuideId).Contains(i.TourGuideId) && i.Status == "Đã hướng dẫn")
                                .Count(),

                            CancelledTours = invoicesQuery
                                .Where(i => g.Select(x => x.tg.TourGuideId).Contains(i.TourGuideId) && i.Status == "Từ chối")
                                .Count(),

                            TotalRequests = invoicesQuery
                                .Where(i => g.Select(x => x.tg.TourGuideId).Contains(i.TourGuideId))
                                .Count(),

                            TotalRevenue = revenuesQuery
                                .Where(r => g.Select(x => x.tg.TourGuideId).Contains(r.TourGuideId))
                                .Sum(r => r.TotalAmount),

                            AverageRating = (decimal)(feedbacksQuery
                                .Where(f => g.Select(x => x.tg.TourGuideId).Contains(f.TourGuideId))
                                .Select(f => (double?)f.Rating)
                                .Average() ?? 0)
                        };

            return await query
                .OrderByDescending(x => x.TotalRevenue)
                .Take(limit)
                .ToListAsync();
        }


        public async Task<UserStatus> GetUserStatsAsync(DateTime? fromDate, DateTime? toDate)
        {
            var userQuery = _context.Accounts.Where(a => a.RoleId == 2); // Assuming RoleId 1 is for regular users
            var guideQuery = _context.Accounts.Where(a => a.RoleId == 3); // Assuming RoleId 2 is for guides

            if (fromDate.HasValue)
            {
                userQuery = userQuery.Where(u => u.CreatedDate >= fromDate.Value);
                guideQuery = guideQuery.Where(g => g.CreatedDate >= fromDate.Value);
            }

            if (toDate.HasValue)
            {
                userQuery = userQuery.Where(u => u.CreatedDate <= toDate.Value);
                guideQuery = guideQuery.Where(g => g.CreatedDate <= toDate.Value);
            }

            var newUsers = await userQuery.CountAsync();
            var newGuides = await guideQuery.CountAsync();
            var totalActiveUsers = await _context.Accounts.CountAsync(u => u.RoleId == 1 && u.Status);
            var totalActiveGuides = await _context.Accounts.CountAsync(g => g.RoleId == 2 && g.Status);

            // Calculate growth rates (simplified - comparing with previous period)
            var periodDays = (toDate ?? DateTime.UtcNow) - (fromDate ?? DateTime.UtcNow.AddMonths(-1));
            var previousFromDate = (fromDate ?? DateTime.UtcNow.AddMonths(-1)) - periodDays;
            var previousToDate = fromDate ?? DateTime.UtcNow.AddMonths(-1);

            var prevNewUsers = await _context.Accounts
                .CountAsync(u => u.RoleId == 1 && u.CreatedDate >= previousFromDate && u.CreatedDate <= previousToDate);
            var prevNewGuides = await _context.Accounts
                .CountAsync(g => g.RoleId == 2 && g.CreatedDate >= previousFromDate && g.CreatedDate <= previousToDate);

            var userGrowthRate = prevNewUsers > 0 ? ((decimal)(newUsers - prevNewUsers) / prevNewUsers) * 100 : 0;
            var guideGrowthRate = prevNewGuides > 0 ? ((decimal)(newGuides - prevNewGuides) / prevNewGuides) * 100 : 0;

            return new UserStatus
            {
                NewUsers = newUsers,
                NewGuides = newGuides,
                TotalActiveUsers = totalActiveUsers,
                TotalActiveGuides = totalActiveGuides,
                UserGrowthRate = userGrowthRate,
                GuideGrowthRate = guideGrowthRate
            };
        }

        public async Task<List<TourPerformance>> GetTopToursAsync(DateTime? fromDate, DateTime? toDate, string? areaFilter, int limit = 10)
        {
            // Group invoices by TourName and AreaId to get unique tours
            var query = from invoice in _context.Invoices
                        join area in _context.ActiveAreas on invoice.AreaId equals area.AreaId
                        where (!fromDate.HasValue || invoice.CreatedDate >= fromDate.Value) &&
                              (!toDate.HasValue || invoice.CreatedDate <= toDate.Value)
                        select new { invoice, area };

            if (!string.IsNullOrEmpty(areaFilter) && areaFilter != "all")
                query = query.Where(x => x.area.AreaName.ToLower() == areaFilter.ToLower());

            var data = await query.ToListAsync();

            // Group by tour name and area to calculate performance metrics
            var tourPerformance = data
                .GroupBy(x => new { x.invoice.TourName, x.invoice.AreaId, x.area.AreaName })
                .Select(g => new TourPerformance
                {
                    TourId = g.First().invoice.InvoiceId, // Use first invoice ID as tour identifier
                    TourTitle = g.Key.TourName,
                    AreaName = g.Key.AreaName,
                    CompletedCount = g.Count(x => x.invoice.Status == "Đã hướng dẫn"),
                    AverageRating = 0, // You might need to implement rating system
                    AverageBids = (decimal)g.Count(),
                    Profit = g.Where(x => x.invoice.Status == "Đã hướng dẫn")
                            .Sum(x => (decimal)x.invoice.Price) * 0.15m // 15% commission
                })
                .OrderByDescending(t => t.Profit)
                .Take(limit)
                .ToList();

            return tourPerformance;
        }

        public async Task<List<GuidePerformance>> GetTopGuidesAsync(DateTime? fromDate, DateTime? toDate, string? areaFilter, int limit = 10)
        {
            var invoiceQuery = _context.Invoices.AsQueryable();
            var feedbackQuery = _context.Feedbacks.AsQueryable();

            if (fromDate.HasValue)
            {
                invoiceQuery = invoiceQuery.Where(i => i.CreatedDate >= fromDate.Value);
            }

            if (toDate.HasValue)
            {
                invoiceQuery = invoiceQuery.Where(i => i.CreatedDate <= toDate.Value);
            }

            var query = from guide in _context.TourGuides
                        join desc in _context.TourGuideDescs on guide.TourGuideId equals desc.TourGuideId
                        join area in _context.ActiveAreas on desc.AreaId equals area.AreaId
                        where string.IsNullOrEmpty(areaFilter) || areaFilter == "all" || area.AreaName.ToLower() == areaFilter.ToLower()
                        select new
                        {
                            guide.TourGuideId,
                            guide.FullName,
                            AreaName = area.AreaName
                        };

            var guideList = await query.Distinct().ToListAsync();

            var result = new List<GuidePerformance>();

            foreach (var g in guideList)
            {
                var guideInvoices = await invoiceQuery
                    .Where(i => i.TourGuideId == g.TourGuideId)
                    .ToListAsync();

                if (guideInvoices.Count == 0)
                    continue;

                var completed = guideInvoices.Where(i => i.Status == "Đã hướng dẫn").ToList();

                var totalRevenue = completed.Sum(i => (decimal)i.Price);
                var completionRate = guideInvoices.Count > 0 ? (decimal)completed.Count / guideInvoices.Count * 100 : 0;

                var ratings = await feedbackQuery
                    .Where(f => f.TourGuideId == g.TourGuideId)
                    .Select(f => (double?)f.Rating)
                    .ToListAsync();

                var averageRating = ratings.Any() ? (decimal)ratings.Average().Value : 0;

                result.Add(new GuidePerformance
                {
                    GuideId = g.TourGuideId,
                    GuideName = g.FullName,
                    AreaName = g.AreaName,
                    TotalTours = completed.Count,
                    AverageRating = averageRating,
                    TotalRevenue = totalRevenue,
                    CompletionRate = completionRate
                });
            }

            return result
                .OrderByDescending(g => g.AverageRating)
                .ThenByDescending(g => g.TotalRevenue)
                .Take(limit)
                .ToList();
        }


        public async Task<List<AreaStatus>> GetCancelledToursByAreaAsync(DateTime? fromDate, DateTime? toDate, int limit = 10)
        {
            var areaStats = await GetAreaStatsAsync(fromDate, toDate, 63); // lấy tất cả để tính chính xác cancelled
            return areaStats
                .Where(r => r.CancelledTours > 0)
                .OrderByDescending(r => r.CancelledTours)
                .Take(limit)
                .ToList();
        }


        public async Task<List<MembershipStatus>> GetMembershipStatsAsync(DateTime? fromDate, DateTime? toDate)
        {
            // Lấy danh sách package và liên kết dữ liệu liên quan ở phía client
            var packages = await _context.MembershipPackages
                .Include(p => p.AccountMemberships)
                .Include(p => p.Payments)
                .ToListAsync();

            var membershipStats = new List<MembershipStatus>();

            var periodDays = (toDate ?? DateTime.UtcNow) - (fromDate ?? DateTime.UtcNow.AddMonths(-1));
            var previousFromDate = (fromDate ?? DateTime.UtcNow.AddMonths(-1)) - periodDays;
            var previousToDate = fromDate ?? DateTime.UtcNow.AddMonths(-1);

            foreach (var package in packages)
            {
                var filteredPayments = package.Payments
                    .Where(p =>
                        (!fromDate.HasValue || p.CreatedAt >= fromDate.Value) &&
                        (!toDate.HasValue || p.CreatedAt <= toDate.Value) && p.PaymentType == "Membership")
                    .ToList() ?? new List<Payment>();

                var durationText = FormatDuration(package.Duration);
                var benefits = ParseBenefits(package.BenefitDesc);

                var totalSales = filteredPayments.Count;
                var revenue = filteredPayments.Sum(p => (decimal)p.Price);

                // Tính số lượng ở kỳ trước
                var prevSales = package.Payments?
                    .Count(p => p.CreatedAt >= previousFromDate && p.CreatedAt <= previousToDate) ?? 0;

                var growthRate = prevSales > 0 ? ((decimal)(totalSales - prevSales) / prevSales) * 100 : 0;

                membershipStats.Add(new MembershipStatus
                {
                    PackageId = package.MembershipPackageId,
                    PackageName = package.Name,
                    Price = (decimal)package.Price,
                    Duration = durationText,
                    TotalSales = totalSales,
                    Revenue = revenue,
                    GrowthRate = growthRate
                });
            }

            return membershipStats
                .OrderByDescending(m => m.TotalSales)
                .Take(10) // thêm giới hạn
                .ToList();
        }


        private List<string> ParseBenefits(string benefitDesc)
        {
            if (string.IsNullOrEmpty(benefitDesc))
                return new List<string>();

            // Split by common delimiters like newlines, semicolons, or bullet points
            var benefits = Regex.Split(benefitDesc, @"[\n;•]+")
                .Where(b => !string.IsNullOrWhiteSpace(b))
                .Select(b => b.Trim())
                .ToList();

            return benefits;
        }

        private string FormatDuration(int durationInDays)
        {
            if (durationInDays % 365 == 0)
            {
                int years = durationInDays / 365;
                return years == 1 ? "1 năm" : $"{years} năm";
            }
            else if (durationInDays % 30 == 0)
            {
                int months = durationInDays / 30;
                return months == 1 ? "1 tháng" : $"{months} tháng";
            }
            else if (durationInDays % 7 == 0)
            {
                int weeks = durationInDays / 7;
                return weeks == 1 ? "1 tuần" : $"{weeks} tuần";
            }
            else
            {
                return durationInDays == 1 ? "1 tháng" : $"{durationInDays} tháng";
            }
        }
    }
}
