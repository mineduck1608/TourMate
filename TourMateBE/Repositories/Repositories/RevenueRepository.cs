using Microsoft.EntityFrameworkCore;
using Repositories.DTO;
using Repositories.GenericRepository;
using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Repository
{
    public class RevenueRepository : GenericRepository<Revenue>
    {
        public async Task<IEnumerable<Revenue>> GetAllRevenuesAsync()
        {
            return await _context.Revenues
                .Include(r => r.TourGuide)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<Revenue?> GetRevenueByIdAsync(int revenueId)
        {
            return await _context.Revenues
                .Include(r => r.TourGuide)
                .FirstOrDefaultAsync(r => r.RevenueId == revenueId);
        }

        public async Task<IEnumerable<Revenue>> GetRevenuesByTourGuideAsync(int tourGuideId)
        {
            return await _context.Revenues
                .Include(r => r.TourGuide)
                .Where(r => r.TourGuideId == tourGuideId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Revenue>> GetRevenuesByMonthAsync(int tourGuideId, int month, int year)
        {
            return await _context.Revenues
                .Include(r => r.TourGuide)
                .Where(r => r.TourGuideId == tourGuideId
                    && r.CreatedAt.Month == month
                    && r.CreatedAt.Year == year)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<MonthlyRevenueDto> GetMonthlyStatsAsync(int tourGuideId, int month, int year)
        {
            var revenues = await GetRevenuesByMonthAsync(tourGuideId, month, year);
            var previousMonthRevenue = await GetPreviousMonthRevenueAsync(tourGuideId, month, year);

            var totalRevenue = revenues.Sum(r => r.TotalAmount);
            var platformFee = revenues.Sum(r => r.PlatformCommission);
            var netRevenue = revenues.Sum(r => r.ActualReceived);

            var growthPercentage = previousMonthRevenue > 0
                ? ((totalRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
                : 0;

            return new MonthlyRevenueDto
            {
                Month = month,
                Year = year,
                TotalRevenue = totalRevenue,
                PlatformFee = platformFee,
                NetRevenue = netRevenue,
                TotalRecords = revenues.Count(),
                CompletedPayments = revenues.Count(r => r.PaymentStatus),
                PendingPayments = revenues.Count(r => !r.PaymentStatus),
                GrowthPercentage = growthPercentage
            };
        }

        public async Task<IEnumerable<Revenue>> GetRevenuesWithFilterAsync(RevenueFilterDto filter)
        {
            var query = _context.Revenues
                .Include(r => r.TourGuide)
                .Where(r => r.TourGuideId == filter.TourGuideId);

            if (filter.Month > 0 && filter.Year > 0)
            {
                query = query.Where(r => r.CreatedAt.Month == filter.Month && r.CreatedAt.Year == filter.Year);
            }

            if (filter.PaymentStatus.HasValue)
            {
                query = query.Where(r => r.PaymentStatus == filter.PaymentStatus.Value);
            }

            return await query
                .OrderByDescending(r => r.CreatedAt)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();
        }

        public async Task<int> GetTotalRevenueCountAsync(RevenueFilterDto filter)
        {
            var query = _context.Revenues.Where(r => r.TourGuideId == filter.TourGuideId);

            if (filter.Month > 0 && filter.Year > 0)
            {
                query = query.Where(r => r.CreatedAt.Month == filter.Month && r.CreatedAt.Year == filter.Year);
            }

            if (filter.PaymentStatus.HasValue)
            {
                query = query.Where(r => r.PaymentStatus == filter.PaymentStatus.Value);
            }

            return await query.CountAsync();
        }

        public async Task<decimal> GetTotalRevenueAmountAsync(int tourGuideId, int month, int year)
        {
            return await _context.Revenues
                .Where(r => r.TourGuideId == tourGuideId
                    && r.CreatedAt.Month == month
                    && r.CreatedAt.Year == year)
                .SumAsync(r => r.TotalAmount);
        }

        public async Task<decimal> GetPreviousMonthRevenueAsync(int tourGuideId, int month, int year)
        {
            var previousMonth = month == 1 ? 12 : month - 1;
            var previousYear = month == 1 ? year - 1 : year;

            return await _context.Revenues
                .Where(r => r.TourGuideId == tourGuideId
                    && r.CreatedAt.Month == previousMonth
                    && r.CreatedAt.Year == previousYear)
                .SumAsync(r => r.TotalAmount);
        }

        public async Task<Revenue> CreateRevenueAsync(Revenue revenue)
        {
            _context.Revenues.Add(revenue);
            await _context.SaveChangesAsync();
            return revenue;
        }

        public async Task<Revenue> UpdateRevenueAsync(Revenue revenue)
        {
            _context.Revenues.Update(revenue);
            await _context.SaveChangesAsync();
            return revenue;
        }

        public async Task<bool> DeleteRevenueAsync(int revenueId)
        {
            var revenue = await _context.Revenues.FindAsync(revenueId);
            if (revenue == null) return false;

            _context.Revenues.Remove(revenue);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
