using Microsoft.EntityFrameworkCore;
using Repositories.GenericRepository;
using Repositories.Models;

namespace Repositories.Repository
{
    public class InvoiceRepository : GenericRepository<Invoice>
    {
        public async Task<(List<Invoice>, int)> GetPagedAsync(string status, string search, int page, int pageSize, int accountId, string role)
        {
            var query = _context.Invoices
                .Include(c => c.Customer).ThenInclude(a => a.Account)
                .Include(c => c.TourGuide)
                .Include(a => a.Area)
                .AsQueryable();

            // Lọc theo role và accountId
            if (role == "Customer")
            {
                query = query.Where(a => a.Customer.AccountId == accountId);
            }
            else if (role == "TourGuide")
            {
                query = query.Where(a => a.TourGuide.AccountId == accountId);
            }

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(s => s.Status == status);
            }

            if (!string.IsNullOrEmpty(search))
            {
                search = search.ToLower();
                query = query.Where(s =>
                    s.Customer.FullName.ToLower().Contains(search) ||
                    s.InvoiceId.ToString().Contains(search)
                );
            }

            var totalCount = await query.CountAsync();
            var data = await query
                .OrderByDescending(s => s.CreatedDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (data, totalCount);
        }

        public async Task<Invoice> GetScheduleByInvoiceIdAsync(int invoiceId)
        {
            var query = _context.Invoices
                .Include(c => c.Customer).ThenInclude(a => a.Account)
                .Include(c => c.TourGuide)
                .Include(a => a.Area)
                .AsQueryable();

            var data = await query.FirstOrDefaultAsync(i => i.InvoiceId == invoiceId);
            return data;
        }

        public async Task<Invoice> GetAccountByInvoiceAsync(int invoiceId)
        {
            var query = _context.Invoices
                .Include(c => c.Customer).ThenInclude(a => a.Account)
                .AsQueryable();

            var data = await query.FirstOrDefaultAsync(i => i.InvoiceId == invoiceId);
            return data;
        }

    }
}