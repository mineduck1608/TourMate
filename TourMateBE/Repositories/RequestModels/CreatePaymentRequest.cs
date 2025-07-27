using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.RequestModels
{
    public class CreatePaymentRequest
    {
        public string Type { get; set; }
        public float Amount { get; set; }
    }

}
