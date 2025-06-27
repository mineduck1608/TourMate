using Repositories.Models;
using Repositories.GenericRepository;
using Microsoft.EntityFrameworkCore;
using Repositories.Context;
using Repositories.IRepositories;

namespace Repositories.Repositories
{
    public class FeedbackRepository : GenericRepository<Feedback>, IFeedbackRepository
    {

        public FeedbackRepository(TourmateContext context) : base(context)
        {
        }

        public async Task<Feedback?> GetByInvoiceAsync(int invoiceId)
        {
            return await _context.Feedbacks.FirstOrDefaultAsync(i => i.InvoiceId == invoiceId);
        }

        public async Task<List<Feedback>> GetByAccountAsync(int accountId)
        {
            return await _context.Feedbacks
                .Include(f => f.TourGuide)
                .Include(f => f.Customer)
                .Where(f => f.TourGuide.AccountId == accountId)
                .ToListAsync();
        }

        public async Task<Feedback?> GetByIdContainInvoiceAsync(int id)
        {
            return await _context.Feedbacks
                .Include(f => f.Invoice)
                .Include(f => f.TourGuide)
                .Include(f => f.Customer)
                .FirstOrDefaultAsync(f => f.FeedbackId == id);
        }

        public async Task<List<Feedback>> GetTourGuideFeedbacksAsync(int tourGuideId, int page, int pageSize)
        {
            return await _context.Feedbacks
                .Include(f => f.Customer).ThenInclude(c => c.Account)
                .Include(f => f.Invoice)
                .Where(f => f.TourGuideId == tourGuideId && !f.IsDeleted)
                .OrderByDescending(f => f.CreatedDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> GetTourGuideFeedbackCountAsync(int tourGuideId)
        {
            return await _context.Feedbacks
                .Where(f => f.TourGuideId == tourGuideId && !f.IsDeleted)
                .CountAsync();
        }

        public async Task<IEnumerable<Feedback>> GetAllFeedbackAsync()
        {
            return await _context.Feedbacks
                .Include(f => f.Customer).ThenInclude(c => c.Account)
                .Include(f => f.TourGuide).ThenInclude(tg => tg.Account)
                .Include(f => f.Invoice)
                .Where(f => !f.IsDeleted)
                .OrderByDescending(f => f.CreatedDate)
                .ToListAsync();
        }

        public async Task<Feedback?> GetFeedbackByIdAsync(int id)
        {
            return await _context.Feedbacks
                .Include(f => f.Customer).ThenInclude(c => c.Account)
                .Include(f => f.TourGuide).ThenInclude(tg => tg.Account)
                .Include(f => f.Invoice)
                .FirstOrDefaultAsync(f => f.FeedbackId == id && !f.IsDeleted);
        }

        public async Task<IEnumerable<Feedback>> GetByTourGuideIdAsync(int tourGuideId)
        {
            return await _context.Feedbacks
                .Include(f => f.Customer).ThenInclude(c => c.Account)
                .Include(f => f.TourGuide).ThenInclude(tg => tg.Account)
                .Include(f => f.Invoice)
                .Where(f => f.TourGuideId == tourGuideId && !f.IsDeleted)
                .OrderByDescending(f => f.CreatedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Feedback>> GetByCustomerIdAsync(int customerId)
        {
            return await _context.Feedbacks
                .Include(f => f.Customer).ThenInclude(c => c.Account)
                .Include(f => f.TourGuide).ThenInclude(tg => tg.Account)
                .Include(f => f.Invoice)
                .Where(f => f.CustomerId == customerId && !f.IsDeleted)
                .OrderByDescending(f => f.CreatedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Feedback>> GetByRatingAsync(int rating)
        {
            return await _context.Feedbacks
                .Include(f => f.Customer).ThenInclude(c => c.Account)
                .Include(f => f.TourGuide).ThenInclude(tg => tg.Account)
                .Include(f => f.Invoice)
                .Where(f => f.Rating == rating && !f.IsDeleted)
                .OrderByDescending(f => f.CreatedDate)
                .ToListAsync();
        }

        public async Task<decimal> GetAverageRatingAsync()
        {
            var average = await _context.Feedbacks
     .Where(f => !f.IsDeleted)
     .AverageAsync(f => (double?)f.Rating);

            return average.HasValue ? (decimal)average.Value : 0;
        }

        public async Task<Dictionary<int, int>> GetRatingDistributionAsync()
        {
            var distribution = await _context.Feedbacks
                .Where(f => !f.IsDeleted)
                .GroupBy(f => f.Rating)
                .Select(g => new { g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Key, x => x.Count);

            for (int i = 1; i <= 5; i++)
                if (!distribution.ContainsKey(i)) distribution[i] = 0;

            return distribution;
        }
    }
}
