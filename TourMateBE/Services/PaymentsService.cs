using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface IPaymentsService
    {
        Task<Payment> GetPayments(int id);
        IEnumerable<Payment> GetAll(int pageSize, int pageIndex);
        Task<Payment> CreatePayments(Payment payments);
        void UpdatePayments(Payment payments);
        bool DeletePayments(int id);
    }

    public class PaymentsService : IPaymentsService
    {
        private PaymentsRepository PaymentsRepository { get; set; } = new();

        public async Task<Payment> GetPayments(int id)
        {
            return await PaymentsRepository.GetByIdAsync(id);
        }

        public IEnumerable<Payment> GetAll(int pageSize, int pageIndex)
        {
            return PaymentsRepository.GetAll(pageSize, pageIndex);
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