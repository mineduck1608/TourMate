using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using Services.Utils;

namespace Services.VnPay
{
    public class VNPayService
    {
        private readonly IConfiguration _config;

        public VNPayService(IConfiguration config)
        {
            _config = config;
        }

        public string CreatePaymentUrl(HttpContext context, decimal amount, string orderId)
        {
            var vnp_ReturnUrl = _config["VNPay:ReturnUrl"];  // Ví dụ: https://yourdomain.com/vnpay-return
            var vnp_Url = _config["VNPay:PayUrl"];            // Ví dụ: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
            var vnp_TmnCode = _config["VNPay:TmnCode"];       // Mã merchant cấp bởi VNPay (sandbox hoặc production)
            var vnp_HashSecret = _config["VNPay:HashSecret"]; // Secret key dùng để tạo chữ ký

            var createDate = DateTime.Now.ToString("yyyyMMddHHmmss");

            var vnpay = new VnPayLibrary();
            vnpay.AddRequestData("vnp_Version", "2.1.0");
            vnpay.AddRequestData("vnp_Command", "pay");
            vnpay.AddRequestData("vnp_TmnCode", vnp_TmnCode);
            vnpay.AddRequestData("vnp_Amount", ((int)(amount * 100)).ToString()); // nhân 100
            vnpay.AddRequestData("vnp_CurrCode", "VND");
            vnpay.AddRequestData("vnp_TxnRef", orderId);
            vnpay.AddRequestData("vnp_OrderInfo", $"Thanh toan don hang {orderId}");
            vnpay.AddRequestData("vnp_OrderType", "other");
            vnpay.AddRequestData("vnp_Locale", "vn");
            vnpay.AddRequestData("vnp_ReturnUrl", vnp_ReturnUrl);
            vnpay.AddRequestData("vnp_IpAddr", context.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1");
            vnpay.AddRequestData("vnp_CreateDate", createDate);

            // Nếu muốn giới hạn thời gian thanh toán, có thể thêm:
            // vnpay.AddRequestData("vnp_ExpireDate", DateTime.Now.AddMinutes(15).ToString("yyyyMMddHHmmss"));

            return vnpay.CreateRequestUrl(vnp_Url, vnp_HashSecret);
        }
    }
}
