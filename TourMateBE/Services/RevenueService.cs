using Org.BouncyCastle.Crypto;
using Repositories.DTO;
using Repositories.Models;
using Repositories.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;


namespace Services
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
    public class RevenueService : IRevenueService
    {
        private RevenueRepository _revenueRepository;
        private readonly IMapper _mapper;

        public RevenueService(RevenueRepository revenueRepository, IMapper mapper)
        {
            _revenueRepository = revenueRepository;
            _mapper = mapper;
        }

        public async Task<bool> CreateRevenue(Revenue revenue)
        {
            return await _revenueRepository.CreateAsync(revenue);
        }

        public async Task<RevenueStatsDto> GetRevenueStatsAsync(int tourGuideId, int month, int year)
        {
            var revenues = await _revenueRepository.GetRevenuesByMonthAsync(tourGuideId, month, year);
            var monthlyStats = await _revenueRepository.GetMonthlyStatsAsync(tourGuideId, month, year);

            var revenueList = _mapper.Map<List<RevenueDto>>(revenues);

            return new RevenueStatsDto
            {
                TotalRevenue = monthlyStats.TotalRevenue,
                PlatformFee = monthlyStats.PlatformFee,
                NetRevenue = monthlyStats.NetRevenue,
                TotalRecords = monthlyStats.TotalRecords,
                CompletedPayments = monthlyStats.CompletedPayments,
                PendingPayments = monthlyStats.PendingPayments,
                MonthlyGrowth = monthlyStats.GrowthPercentage,
                RevenueList = revenueList
            };
        }

        public async Task<MonthlyRevenueDto> GetMonthlyRevenueAsync(int tourGuideId, int month, int year)
        {
            return await _revenueRepository.GetMonthlyStatsAsync(tourGuideId, month, year);
        }

        public async Task<IEnumerable<RevenueDto>> GetRevenueListAsync(RevenueFilterDto filter)
        {
            var revenues = await _revenueRepository.GetRevenuesWithFilterAsync(filter);
            return _mapper.Map<IEnumerable<RevenueDto>>(revenues);
        }

        public async Task<RevenueDto?> GetRevenueByIdAsync(int revenueId)
        {
            var revenue = await _revenueRepository.GetRevenueByIdAsync(revenueId);
            return revenue != null ? _mapper.Map<RevenueDto>(revenue) : null;
        }

        public async Task<RevenueDto> CreateRevenueAsync(RevenueDto revenueDto)
        {
            var revenue = _mapper.Map<Revenue>(revenueDto);
            revenue.CreatedAt = DateTime.UtcNow;

            var createdRevenue = await _revenueRepository.CreateRevenueAsync(revenue);
            return _mapper.Map<RevenueDto>(createdRevenue);
        }

        public async Task<RevenueDto> UpdateRevenueAsync(int revenueId, RevenueDto revenueDto)
        {
            var existingRevenue = await _revenueRepository.GetRevenueByIdAsync(revenueId);
            if (existingRevenue == null)
                throw new ArgumentException("Revenue not found");

            _mapper.Map(revenueDto, existingRevenue);
            var updatedRevenue = await _revenueRepository.UpdateRevenueAsync(existingRevenue);
            return _mapper.Map<RevenueDto>(updatedRevenue);
        }

        public async Task<bool> DeleteRevenueAsync(int revenueId)
        {
            return await _revenueRepository.DeleteRevenueAsync(revenueId);
        }

        public async Task<decimal> CalculateGrowthPercentageAsync(int tourGuideId, int month, int year)
        {
            var currentMonthRevenue = await _revenueRepository.GetTotalRevenueAmountAsync(tourGuideId, month, year);
            var previousMonthRevenue = await _revenueRepository.GetPreviousMonthRevenueAsync(tourGuideId, month, year);

            if (previousMonthRevenue == 0) return 0;
            return ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
        }
    }
}
