using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Services.Utils
{
    public class ValidInput
    {
        public static bool IsPhoneFormatted(string phone) => !string.IsNullOrEmpty(phone) ? new Regex(@"^0[9832]\d{8}$").IsMatch(phone) : false;

        public static bool IsPasswordSecure(string password) => !string.IsNullOrEmpty(password) ? new Regex(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?])[A-Za-z\d!@#$%^&*()_\-+=<>?]{12,}$").IsMatch(password) : false;

        public static bool IsMailFormatted(string mail) => !string.IsNullOrEmpty(mail) ? new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$").IsMatch(mail) : false;
    }
}
