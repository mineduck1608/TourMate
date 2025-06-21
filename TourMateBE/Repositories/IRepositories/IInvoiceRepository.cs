using Repositories.GenericRepository;
using Repositories.Models;

namespace Repositories.IRepositories
{
    public interface IInvoiceRepository : IGenericRepository<Invoice>
    {
        Task UpdateStatusAsync(int invoiceId, string newStatus);
        Task<(List<Invoice>, int)> GetPagedAsync(string status, string search, int page, int pageSize, int accountId, string role);
        Task<Invoice> GetScheduleByInvoiceIdAsync(int invoiceId);
        Task<Invoice> GetInvoiceById(int invoiceId);
        Task<Invoice> GetAccountByInvoiceAsync(int invoiceId);
    }
}
