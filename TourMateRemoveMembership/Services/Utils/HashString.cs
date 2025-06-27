using System.Security.Cryptography;
using System.Text;

namespace Services.Utils
{
    public class HashString
    {
        public static string ToHashString(string s)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(s));
                StringBuilder result = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                    result.Append(bytes[i].ToString("x2"));
                return result.ToString();
            }
        }
    }
}
