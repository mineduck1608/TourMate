using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class SystemRevenueCreateModel
    {
        public int PaymentId { get; set; }

        public float Value { get; set; }
        public SystemRevenue Convert() => new()
        {
            PaymentId = PaymentId,
            Value = Value,
            SystemRevenueId = 0,
        };
    }
}