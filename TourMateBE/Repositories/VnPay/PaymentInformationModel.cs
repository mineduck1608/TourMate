using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.VnPay
{
    public class PaymentInformationModel
    {
        public decimal Amount { get; set; }
        public string OrderInfo{ get; set; }
        public string OrderType { get; set; }

    }
}
