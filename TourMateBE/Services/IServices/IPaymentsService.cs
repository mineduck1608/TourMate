using Repositories.Models;
using Repositories.ResponseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface IPaymentsService
    {
        Task<Payment> GetPayments(int id);
        Task<PagedResult<Payment>> GetAll(int pageSize, int pageIndex);
        Task<Payment> CreatePayments(Payment payments);
        void UpdatePayments(Payment payments);
        bool DeletePayments(int id);
        public string GenerateSuccessfulPaymentEmail(string fullName, float price, DateTime createdAt, string paymentType);
        public string GenerateTourGuideInvoiceEmail(Invoice invoice);
        public string GenerateCustomerInvoiceEmail(Invoice invoice);
        Task<List<Payment>> GetByAccountId(int accountId);
    }
}
