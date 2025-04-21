using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface IPaymentsService
    {
        Payment GetPayments(int id);
        IEnumerable<Payment> GetAll(int pageSize, int pageIndex);
        void CreatePayments(Payment payments);
        void UpdatePayments(Payment payments);
        bool DeletePayments(int id);
    }

    public class PaymentsService : IPaymentsService
    {
        private PaymentsRepository PaymentsRepository { get; set; } = new();

        public Payment GetPayments(int id)
        {
            return PaymentsRepository.GetById(id);
        }

        public IEnumerable<Payment> GetAll(int pageSize, int pageIndex)
        {
            return PaymentsRepository.GetAll(pageSize, pageIndex);
        }

        public void CreatePayments(Payment payments)
        {
            PaymentsRepository.Create(payments);
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