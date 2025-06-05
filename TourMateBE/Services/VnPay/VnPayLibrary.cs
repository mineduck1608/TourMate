using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Services.VnPay
{
    public class VnPayLibrary
    {
        private SortedList<string, string> requestData = new();
        private SortedList<string, string> responseData = new();

        public void AddRequestData(string key, string value)
        {
            requestData.Add(key, value);
        }

        public void AddResponseData(string key, string value)
        {
            responseData.Add(key, value);
        }

        public string GetResponseData(string key) => responseData.TryGetValue(key, out var value) ? value : "";

        public string CreateRequestUrl(string baseUrl, string secretKey)
        {
            var data = string.Join("&", requestData.Select(x => $"{x.Key}={HttpUtility.UrlEncode(x.Value)}"));
            var rawData = string.Join("&", requestData.Select(x => $"{x.Key}={x.Value}"));
            var secureHash = HmacSHA256(secretKey, rawData);
            return $"{baseUrl}?{data}&vnp_SecureHashType=SHA256&vnp_SecureHash={secureHash}";
        }


        public bool ValidateSignature(string secretKey)
        {
            var raw = responseData
                .Where(kvp => kvp.Key != "vnp_SecureHash" && kvp.Key != "vnp_SecureHashType")
                .OrderBy(kvp => kvp.Key)
                .Select(kvp => $"{kvp.Key}={kvp.Value}");

            var rawData = string.Join("&", raw);
            var expectedHash = HmacSHA256(secretKey, rawData);
            return responseData["vnp_SecureHash"] == expectedHash;
        }

        private static string HmacSHA256(string key, string data)
        {
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(key)); // Đúng thuật toán
            var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
            return BitConverter.ToString(hashBytes).Replace("-", "").ToUpper(); // PHẢI viết hoa
        }

    }

}
