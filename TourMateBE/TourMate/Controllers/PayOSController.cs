using Microsoft.AspNetCore.Mvc;
using Net.payOS;
using Net.payOS.Types;
using Repositories.Models;
using Repositories.Repository;
using Services;

namespace TourMate.Controllers;

[Route("api/payos")]
[ApiController]
public class PayOSController : ControllerBase
{
    private readonly PayOS _payOS;
    private readonly IMembershipPackagesService _membershipPackagesService;
    private readonly IPaymentsService _paymentsService;
    private readonly IConfiguration _configuration;

    public PayOSController(PayOS payOS, IMembershipPackagesService membershipPackages, IPaymentsService paymentsService, IConfiguration configuration)
    {
        _payOS = payOS;
        _membershipPackagesService = membershipPackages;
        _paymentsService = paymentsService;
        _configuration = configuration;
    }

    [HttpPost("create-embedded-payment-link")]
    public async Task<IActionResult> Create([FromQuery] string type, [FromQuery] float amount)
    {
        // 2. Lấy cấu hình từ appsettings.json hoặc secrets
        var clientId = _configuration["PayOS:ClientId"];
        var apiKey = _configuration["PayOS:ApiKey"];
        var checksumKey = _configuration["PayOS:ChecksumKey"];

        var payOS = new PayOS(clientId, apiKey, checksumKey);

        var roundedAmount = (int)Math.Round(amount);

        var paymentLinkRequest = new PaymentData(
                orderCode: int.Parse(DateTimeOffset.Now.ToString("ffffff")),
            amount: roundedAmount,
            description: $"Thanh toán {type}",
            items: [new(type, 1, roundedAmount)],
            returnUrl: _configuration["ReturnURL:Success"],
            cancelUrl: _configuration["ReturnURL:Failed"]
        );

        // 4. Tạo link thanh toán từ PayOS
        var response = await payOS.createPaymentLink(paymentLinkRequest);

        //// 5. Cập nhật lại thông tin thanh toán vào DB
        //payment.PaymentId = (int)response.orderCode;
        //payment.CheckoutUrl = response.checkoutUrl;
        //await _paymentsRepo.UpdateAsync(payment);

        return new JsonResult(response);
    }
}
