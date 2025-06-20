using Repositories.Models;
using Repositories.GenericRepository;
using Microsoft.EntityFrameworkCore;

namespace Repositories.Repository
{
    public class FeedbackRepository : GenericRepository<Feedback>
    {
        public async Task<Feedback> GetByInvoice(int invoiceId)
        {
            var result = _context.Feedbacks.FirstOrDefault(i => i.InvoiceId == invoiceId);
            return result;
        }

        public async Task<Feedback> GetByIdContainInvoice(int id)
        {
            var result = _context.Feedbacks.Include(i => i.Invoice).Include(tg => tg.TourGuide).Include(cs => cs.Customer).FirstOrDefault(f => f.FeedbackId == id);
            return result;
        }

        public async Task<List<Feedback>> GetTourGuideFeedbacksAsync(int tourGuideId, int page, int pageSize)
        {
            return await _context.Feedbacks
                .Include(f => f.Customer)
                    .ThenInclude(c => c.Account)
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
    }
}