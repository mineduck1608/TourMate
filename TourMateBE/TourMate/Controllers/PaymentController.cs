using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services;
using Services.VnPay;

namespace API.Controllers
{
    [Route("api/payment")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly VNPayService _vnPayService;
        private readonly IConfiguration _config;

        public PaymentController(VNPayService vnPayService, IConfiguration config)
        {
            _vnPayService = vnPayService;
            _config = config;
        }

        [HttpGet("create")]
        public IActionResult CreatePayment(decimal amount, string orderId)
        {
            var url = _vnPayService.CreatePaymentUrl(HttpContext, amount, orderId);
            return Ok(new { paymentUrl = url });
        }

        [HttpGet("vnpay-return")]
        public IActionResult VNPayReturn()
        {
            var vnpay = new VnPayLibrary();
            foreach (var (key, value) in Request.Query)
            {
                if (key.StartsWith("vnp_"))
                    vnpay.AddResponseData(key, value);
            }

            bool isValid = vnpay.ValidateSignature(_config["VNPay:HashSecret"]);
            if (!isValid)
                return BadRequest(new { msg = "Sai chữ ký" });

            var responseCode = vnpay.GetResponseData("vnp_ResponseCode");
            if (responseCode == "00")
            {
                return Ok(new { msg = "Thanh toán thành công" });
            }
            else
            {
                return BadRequest(new { msg = "Thanh toán thất bại" });
            }
        }

    }
}