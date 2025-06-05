using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Repositories.VnPay;
using Services;
using Services.VnPay;

namespace API.Controllers
{
    [Route("api/payment")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;
        private readonly IConfiguration _config;
        private readonly IInvoiceService _invoiceService;
        private readonly IPaymentsService _paymentService;

        public PaymentController(IVnPayService vnPayService, IConfiguration config, IInvoiceService invoiceService, IPaymentsService paymentService)
        {
            _vnPayService = vnPayService;
            _config = config;
            _invoiceService = invoiceService;
            _paymentService = paymentService;
        }

        //[HttpGet("create")]
        //public IActionResult CreatePayment(decimal amount, string orderId)
        //{
        //    var url = _vnPayService.CreatePaymentUrl(HttpContext, amount, orderId);
        //    return Ok(new { paymentUrl = url });
        //}

        [HttpGet("create")]
        public async Task<IActionResult> CreatePaymentUrlVnpay(decimal amount, string orderId, string orderType)
        {
            return HandlePaymentUrl(new()
            {
                Amount = amount,
                OrderType = orderType,
                OrderInfo = orderId
            });
        }
        private IActionResult HandlePaymentUrl(PaymentInformationModel model)
        {
            var url = _vnPayService.CreatePaymentUrl(model, HttpContext);

            return Ok(new { paymentUrl = url });
        }

        //[HttpGet("vnpay-return")]
        //public IActionResult VNPayReturn()
        //{
        //    var vnpay = new VnPayLibrary();
        //    foreach (var (key, value) in Request.Query)
        //    {
        //        if (key.StartsWith("vnp_"))
        //            vnpay.AddResponseData(key, value);
        //    }

        //    bool isValid = vnpay.ValidateSignature(_config["VNPay:HashSecret"]);
        //    if (!isValid)
        //        return BadRequest(new { msg = "Sai chữ ký" });

        //    var responseCode = vnpay.GetResponseData("vnp_ResponseCode");
        //    if (responseCode == "00")
        //    {
        //        return Ok(new { msg = "Thanh toán thành công" });
        //    }
        //    else
        //    {
        //        return BadRequest(new { msg = "Thanh toán thất bại" });
        //    }
        //}
        [HttpGet("vnpay-return")]
        public async Task<IActionResult> PaymentCallbackVnpay()
        {
            var response = _vnPayService.PaymentExecute(Request.Query);
            if (!response.Success)
            {
                return Redirect($"http://localhost:3000/pay-result?success=false");
            }

            try
            {
                if (response.OrderDescription != "Membership")
                {
                    // Order desc is txn id
                    var invoiceId = response.OrderDescription;
                    // Convert txnId from string to int to match the method signature
                    if (!int.TryParse(invoiceId, out var invoiceIdInt))
                    {
                        return Redirect($"http://localhost:3000/pay-result?success=false");
                    }
                    var s = await _invoiceService.GetInvoice(invoiceIdInt);
                    s.Status = "Sắp diễn ra";
                    await _invoiceService.UpdateInvoice(s);

                    var account = await _invoiceService.GetAccountByInvoice(invoiceIdInt);

                    var data = new PaymentCreateModel
                    {
                        InvoiceId = s.InvoiceId,
                        Price = response.Amount,
                        CompleteDate = DateTime.Now,
                        PaymentType = "Invoice",
                        PaymentMethod = "VNPay",
                        Status = "Thành công",
                        AccountId = account.Customer.Account.AccountId,
                    };

                    var payment = data.Convert();

                    var result = await _paymentService.CreatePayments(payment);
                    if (!result)
                    {
                        return Redirect($"http://localhost:3000/pay-result?success=false");

                    }

                }
                if(response.OrderDescription == "Membership")
                {
                    //var tr = await _invoiceService.GetTransactionById(txnIdInt);
                    //if (tr == null)
                    //    return Redirect($"http://localhost:3000/pay-result?success=false");

                    //var result = await UpdateServiceTransaction(tr);
                    //result.Add("success", "True");
                    //return Redirect($"http://localhost:3000/pay-result?{Util.QueryStringFromDict(result)}");
                }
                return Redirect($"http://localhost:3000/pay-result?success=true");
            }
            catch (Exception ex)
            {
                return Redirect($"http://localhost:3000/pay-result?success=false");
            }
        }
    }
}