using Repositories.Models;
using Repositories.ResponseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface IInvoiceService
    {
        Task<Invoice> GetInvoice(int id);
        IEnumerable<Invoice> GetAll(int pageSize, int pageIndex);
        Task<bool> CreateInvoice(Invoice invoice);
        Task<bool> UpdateInvoice(Invoice invoice);
        bool DeleteInvoice(int id);
        Task<PagedResult<TourSchedule>> GetPagedAsync(string status, string search, int page, int pageSize, int accountId, string role);
        Task<TourSchedule> GetScheduleByInvoiceIdAsync(int invoiceId);
        Task<Invoice> GetAccountByInvoice(int id);
    }

}
