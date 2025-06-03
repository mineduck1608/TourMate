using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface IInvoiceService
    {
        Invoice GetInvoice(int id);
        IEnumerable<Invoice> GetAll(int pageSize, int pageIndex);
        Task<bool> CreateInvoice(Invoice invoice);
        void UpdateInvoice(Invoice invoice);
        bool DeleteInvoice(int id);
    }

    public class InvoiceService : IInvoiceService
    {
        private InvoiceRepository InvoiceRepository { get; set; } = new();

        public Invoice GetInvoice(int id)
        {
            return InvoiceRepository.GetById(id);
        }

        public IEnumerable<Invoice> GetAll(int pageSize, int pageIndex)
        {
            return InvoiceRepository.GetAll(pageSize, pageIndex);
        }

        public async Task<bool> CreateInvoice(Invoice invoice)
        {
            return await InvoiceRepository.CreateAsync(invoice);
        }

        public void UpdateInvoice(Invoice invoice)
        {
            InvoiceRepository.Update(invoice);
        }

        public bool DeleteInvoice(int id)
        {
            InvoiceRepository.Remove(id);
            return true;
        }
    }
}