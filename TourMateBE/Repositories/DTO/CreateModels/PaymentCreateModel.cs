using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class PaymentCreateModel
    {
        public int PaymentId { get; set; }

        public float Price { get; set; }

        public string Status { get; set; }

        public DateTime CompleteDate { get; set; }

        /// <summary>
        /// membership / invoice
        /// </summary>
        public string PaymentType { get; set; }

        /// <summary>
        /// momo/ vnpay
        /// </summary>
        public string PaymentMethod { get; set; }

        public int AccountId { get; set; }

        public int? MembershipPackageId { get; set; }

        public int? InvoiceId { get; set; }
        public Payment Convert() => new()
        {
            PaymentId = 0,
            Price = Price,
            Status = Status,
            CompleteDate = CompleteDate,
            PaymentType = PaymentType,
            PaymentMethod = PaymentMethod,
            AccountId = AccountId,
            MembershipPackageId = MembershipPackageId,
            InvoiceId = InvoiceId,
        };
    }
}