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
    }
}