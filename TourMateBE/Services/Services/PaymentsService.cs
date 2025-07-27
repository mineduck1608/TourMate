using Repositories.Models;
using Repositories.IRepositories;
using Repositories.ResponseModels;
using Services.IServices;
using Repositories.MailBody;

namespace Services.Services
{
    public class PaymentsService : IPaymentsService
    {
        private IPaymentsRepository PaymentsRepository;

        public PaymentsService(IPaymentsRepository paymentsRepository)
        {
            PaymentsRepository = paymentsRepository ?? throw new ArgumentNullException(nameof(paymentsRepository));
        }

        public async Task<List<Payment>>GetByAccountId(int accountId)
        {
            return await PaymentsRepository.GetByAccountId(accountId);
        }
        public async Task<Payment> GetPayments(int id)
        {
            return await PaymentsRepository.GetByIdAsync(id);
        }

        public async Task<PagedResult<Payment>> GetAll(int pageSize, int pageIndex)
        {
            return await PaymentsRepository.GetAllPaged(pageSize, pageIndex);
        }

        public async Task<Payment> CreatePayments(Payment payments)
        {
            return await PaymentsRepository.CreateAndReturnAsync(payments);
        }

        public void UpdatePayments(Payment payments)
        {
            PaymentsRepository.Update(payments);
        }

        public bool DeletePayments(int id)
        {
            PaymentsRepository.Remove(id);
            return true;
        }
     }
}