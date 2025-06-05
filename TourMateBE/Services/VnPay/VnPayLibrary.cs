using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace Services.VnPay
{ 
public class VnPayLibrary
{
    private SortedList<string, string> requestData = new();

    public void AddRequestData(string key, string value)
    {
        if (!string.IsNullOrEmpty(value))
        {
            requestData[key] = value;
        }
    }

    // Tạo URL đầy đủ với chữ ký vnp_SecureHash
    public string CreateRequestUrl(string baseUrl, string secretKey)
    {
        // 1. Sắp xếp requestData theo key tăng dần (theo yêu cầu VNPay)
        var sortedData = new SortedDictionary<string, string>(requestData);

        // 2. Chuẩn bị chuỗi dữ liệu raw để tạo chữ ký (chưa encode URL)
        var rawData = string.Join("&", sortedData.Select(kvp => $"{kvp.Key}={kvp.Value}"));

        // 3. Tạo chữ ký HMAC SHA256 chữ hoa (VNPay yêu cầu chữ hoa)
        var secureHash = HmacSHA256(secretKey, rawData).ToUpper();

        // 4. Chuẩn bị chuỗi URL encode các tham số
        var encodedData = string.Join("&", sortedData.Select(kvp => $"{kvp.Key}={HttpUtility.UrlEncode(kvp.Value)}"));

        // 5. Trả về URL hoàn chỉnh có thêm tham số vnp_SecureHash
        return $"{baseUrl}?{encodedData}&vnp_SecureHash={secureHash}";
    }

    private static string HmacSHA256(string key, string data)
    {
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(key));
        var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
        return BitConverter.ToString(hashBytes).Replace("-", "");
    }
}
}
