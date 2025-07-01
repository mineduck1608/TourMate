using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto;
using Repositories.DTO;
using Repositories.IRepositories;
using Repositories.Models;
using Repositories.ResponseModels;
using Services.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Services.Services
{
    public class RevenueService : IRevenueService
    {
        private IRevenueRepository _revenueRepository;
        private readonly IMapper _mapper;

        public RevenueService(IRevenueRepository revenueRepository, IMapper mapper)
        {
            _revenueRepository = revenueRepository;
            _mapper = mapper;
        }

        public async Task<RevenueAdmin?> GetAdminRevenueByIdAsync(int revenueId)
        {
            var revenue = await _revenueRepository.GetByIdWithDetailsAsync(revenueId);
            return revenue != null ? MapToAdminDto(revenue) : null;
        }

        public async Task<PagedResult<RevenueAdmin>> GetUnpaidRevenuesAsync(int page, int pageSize, string? searchTerm = null)
        {
            var (revenues, totalCount) = await _revenueRepository.GetUnpaidRevenuesAsync(page, pageSize, searchTerm);

            var revenueAdminDtos = revenues.Select(MapToAdminDto).ToList();

            return new PagedResult<RevenueAdmin>
            {
                Result = revenueAdminDtos,
                TotalResult = totalCount,
                TotalPage = (int)Math.Ceiling((double)totalCount / pageSize)
            };
        }

        public async Task<PaymentResultAdmin> ProcessPaymentAsync(List<int> revenueIds, int adminId)
        {
            if (!revenueIds.Any())
                throw new ArgumentException("Không có revenue ID nào được cung cấp");

            // Get all revenues to validate they belong to same tour guide
            var revenues = await _revenueRepository.GetByIdsAsync(revenueIds);

            if (!revenues.Any())
                throw new ArgumentException("Không tìm thấy revenue hợp lệ");

            var tourGuideIds = revenues.Select(r => r.TourGuideId).Distinct().ToList();
            if (tourGuideIds.Count > 1)
                throw new ArgumentException("Tất cả revenue phải thuộc về cùng một hướng dẫn viên");

            // Check if any revenue is already paid
            var alreadyPaid = revenues.Where(r => r.PaymentStatus).ToList();
            if (alreadyPaid.Any())
                throw new ArgumentException($"Một số revenue đã được thanh toán: {string.Join(", ", alreadyPaid.Select(r => r.RevenueId))}");

            var totalAmount = revenues.Sum(r => r.ActualReceived);
            var tourGuideName = revenues.First().TourGuide.FullName;

            // Simply update payment status to true - Admin will handle the actual bank transfer
            await _revenueRepository.UpdatePaymentStatusAsync(revenueIds, true);

            return new PaymentResultAdmin
            {
                Success = true,
                PaymentId = 0, // Not needed since we don't create payment history record
                TotalAmount = totalAmount,
                ProcessedCount = revenueIds.Count,
                Message = $"Đã đánh dấu thanh toán thành công cho {tourGuideName}. Vui lòng thực hiện chuyển khoản theo thông tin ngân hàng."
            };
        }

        public async Task<PagedResult<PaymentHistoryAdmin>> GetPaymentHistoryAsync(int page, int pageSize)
        {
            var (paidRevenues, totalCount) = await _revenueRepository.GetPaidRevenuesAsync(page, pageSize);

            // Group by tour guide and payment date (assuming same day payments are grouped)
            var groupedPayments = paidRevenues
                .GroupBy(r => new { r.TourGuideId, PaymentDate = r.CreatedAt.Date })
                .Select(g => new PaymentHistoryAdmin
                {
                    Id = g.First().RevenueId, // Use first revenue ID as identifier
                    TourGuideName = g.First().TourGuide.FullName,
                    TotalAmount = g.Sum(r => r.ActualReceived),
                    PaymentDate = g.Key.PaymentDate.ToString("yyyy-MM-dd"),
                    PaymentMethod = "Chuyển khoản ngân hàng",
                    BankName = g.First().TourGuide.BankName,
                    AccountNumber = MaskAccountNumber(g.First().TourGuide.BankAccountNumber),
                    ToursCount = g.Count()
                })
                .OrderByDescending(p => p.PaymentDate)
                .ToList();

            return new PagedResult<PaymentHistoryAdmin>
            {
                Result = groupedPayments,
                TotalResult = totalCount,
                TotalPage = (int)Math.Ceiling((double)totalCount / pageSize)
            };
        }

        private RevenueAdmin MapToAdminDto(Revenue revenue)
        {
            return new RevenueAdmin
            {
                RevenueId = revenue.RevenueId,
                TourGuideId = revenue.TourGuideId,
                TotalAmount = revenue.TotalAmount,
                ActualReceived = revenue.ActualReceived,
                PlatformCommission = revenue.PlatformCommission,
                CreatedAt = revenue.CreatedAt,
                PaymentStatus = revenue.PaymentStatus,
                InvoiceId = revenue.InvoiceId,
                Invoice = revenue.Invoice != null ? new InvoiceAdmin
                {
                    InvoiceId = revenue.Invoice.InvoiceId,
                    TourName = revenue.Invoice.TourName,
                    CustomerName = revenue.Invoice.Customer.FullName,
                    TotalAmount = (decimal)revenue.Invoice.Price,
                    CreatedAt = revenue.Invoice.CreatedDate
                } : null,
                TourGuide = new TourGuideAdmin
                {
                    TourGuideId = revenue.TourGuide.TourGuideId,
                    Name = revenue.TourGuide.FullName,
                    Email = revenue.TourGuide.Account.Email,
                    Phone = revenue.TourGuide.Phone,
                    BankAccountNumber = revenue.TourGuide.BankAccountNumber,
                    BankName = revenue.TourGuide.BankName
                }
            };
        }

        private string MaskAccountNumber(string accountNumber)
        {
            if (string.IsNullOrEmpty(accountNumber) || accountNumber.Length <= 4)
                return accountNumber;

            return "****" + accountNumber.Substring(accountNumber.Length - 4);
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
            return (currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100;
        }

        public async Task<PagedResult<RevenueDto>> GetAll(int pageSize, int pageIndex)
        {
            return await _revenueRepository.GetAllPaged(pageSize, pageIndex);
        }
    }
}
