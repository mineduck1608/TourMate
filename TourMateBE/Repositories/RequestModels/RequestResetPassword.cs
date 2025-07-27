using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.RequestModels
{
        public record RequestResetPassword(string Email);
        public record ResetPassword(string Token, string NewPassword);
}
