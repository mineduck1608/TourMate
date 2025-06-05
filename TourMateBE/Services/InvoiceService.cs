using Repositories.DTO;
using Repositories.Models;
using Repositories.Repository;

namespace Services
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

    public class InvoiceService : IInvoiceService
    {
        private InvoiceRepository InvoiceRepository { get; set; } = new();
        private AccountRepository AccountRepository { get; set; } = new();


        public async Task<PagedResult<TourSchedule>> GetPagedAsync(string status, string search, int page, int pageSize, int accountId, string role)
        {
            var (entities, totalCount) = await InvoiceRepository.GetPagedAsync(status, search, page, pageSize, accountId, role);

            var items = entities.Select(e => new TourSchedule
            {
                InvoiceId = e.InvoiceId,
                TourGuideName = e.TourGuide.FullName,
                TourGuidePhone = e.TourGuide.Phone,
                CustomerName = e.Customer.FullName,
                CustomerPhone = e.CustomerPhone,
                Email = e.Customer.Account.Email,
                TourName = e.TourName,
                TourDesc = e.TourDesc,
                AreaName = e.Area.AreaName,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                PeopleAmount = e.PeopleAmount,
                Price = e.Price,
                PaymentMethod = e.Payments.FirstOrDefault()?.PaymentMethod ?? "Chưa thanh toán",
                Status = e.Status,
                Note = e.Note,
                CreatedDate = e.CreatedDate
            }).ToList();

            return new PagedResult<TourSchedule>
            {
                Result = items,
                TotalPage = (int)Math.Ceiling((double)totalCount / pageSize)
            };
        }

        public async Task<TourSchedule> GetScheduleByInvoiceIdAsync(int invoiceId)
        {
            var entity = await InvoiceRepository.GetScheduleByInvoiceIdAsync(invoiceId);

            // Map the single entity to a TourSchedule object
            var item = new TourSchedule
            {
                InvoiceId = entity.InvoiceId,
                TourGuideName = entity.TourGuide.FullName,
                TourGuidePhone = entity.TourGuide.Phone,
                CustomerName = entity.Customer.FullName,
                CustomerPhone = entity.CustomerPhone,
                Email = entity.Customer.Account.Email,
                TourName = entity.TourName,
                TourDesc = entity.TourDesc,
                AreaName = entity.Area.AreaName,
                StartDate = entity.StartDate,
                EndDate = entity.EndDate,
                PeopleAmount = entity.PeopleAmount,
                Price = entity.Price,
                PaymentMethod = entity.Payments.FirstOrDefault()?.PaymentMethod ?? "Chưa thanh toán",
                Status = entity.Status,
                Note = entity.Note,
                CreatedDate = entity.CreatedDate
            };

            return item;
        }



        public async Task<Invoice> GetInvoice(int id)
        {
            return await InvoiceRepository.GetByIdAsync(id);
        }

        public async Task<Invoice> GetAccountByInvoice(int id)
        {
            return await InvoiceRepository.GetAccountByInvoiceAsync(id);
        }

        public IEnumerable<Invoice> GetAll(int pageSize, int pageIndex)
        {
            return InvoiceRepository.GetAll(pageSize, pageIndex);
        }

        public async Task<bool> CreateInvoice(Invoice invoice)
        {
            return await InvoiceRepository.CreateAsync(invoice);
        }

        public async Task<bool> UpdateInvoice(Invoice invoice)
        {
            return await InvoiceRepository.UpdateAsync(invoice);
        }

        public bool DeleteInvoice(int id)
        {
            InvoiceRepository.Remove(id);
            return true;
        }
    }
}