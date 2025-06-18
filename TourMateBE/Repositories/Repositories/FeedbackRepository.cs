using Repositories.Models;
using Repositories.GenericRepository;

namespace Repositories.Repository
{
    public class FeedbackRepository : GenericRepository<Feedback>
    {
        public async Task<Feedback> GetByInvoice(int invoiceId)
        {
            var result = _context.Feedbacks.FirstOrDefault(i => i.InvoiceId == invoiceId);
            return result;
        }
    }
}