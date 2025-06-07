using Repositories.Models;
using Repositories.Repository;

namespace Services
{
    public interface IPaymentsService
    {
        Task<Payment> GetPayments(int id);
        IEnumerable<Payment> GetAll(int pageSize, int pageIndex);
        Task<Payment> CreatePayments(Payment payments);
        void UpdatePayments(Payment payments);
        bool DeletePayments(int id);
        public string GenerateSuccessfulPaymentEmail(string fullName, float price, DateTime completeDate, string paymentType);
        public string GenerateTourGuideInvoiceEmail(Invoice invoice);
        public string GenerateCustomerInvoiceEmail(Invoice invoice);
    }

    public class PaymentsService : IPaymentsService
    {
        private PaymentsRepository PaymentsRepository { get; set; } = new();

        public async Task<Payment> GetPayments(int id)
        {
            return await PaymentsRepository.GetByIdAsync(id);
        }

        public IEnumerable<Payment> GetAll(int pageSize, int pageIndex)
        {
            return PaymentsRepository.GetAll(pageSize, pageIndex);
        }

        public async Task<Payment> CreatePayments(Payment payments)
        {
            return await PaymentsRepository.CreateAndReturnAsync(payments);
        }

        public void UpdatePayments(Payment payments)
        {
            PaymentsRepository.Update(payments);
        }

        public bool DeletePayments(int id)
        {
            PaymentsRepository.Remove(id);
            return true;
        }
        public string GenerateCustomerInvoiceEmail(Invoice invoice)
        {
            return $@"
<!DOCTYPE html>
<html lang='vi'>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title>Xác nhận đặt tour - TourMate</title>
  <style>
    body {{
      font-family: 'Segoe UI', Tahoma, sans-serif;
      background-color: #f9fafb;
      margin: 0;
      color: #333;
    }}
    .container {{
      max-width: 600px;
      margin: 30px auto;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      overflow: hidden;
    }}
    .header {{
      background-color: #4CAF50;
      color: #fff;
      text-align: center;
      padding: 20px;
    }}
    .content {{
      padding: 25px 30px;
    }}
    .content h1 {{
      font-size: 20px;
      margin-bottom: 16px;
    }}
    .info-box {{
      background-color: #f0fdf4;
      border-left: 4px solid #34d399;
      padding: 15px;
      margin-bottom: 20px;
      border-radius: 5px;
    }}
    .info-box p {{
      margin: 6px 0;
    }}
    .footer {{
      text-align: center;
      font-size: 13px;
      color: #6b7280;
      padding: 16px;
      background-color: #f3f4f6;
    }}
  </style>
</head>
<body>
  <div class='container'>
    <div class='header'>
      <h2>Thanh toán thành công</h2>
    </div>
    <div class='content'>
      <h1>Chào quý khách,</h1>
      <p>Cảm ơn bạn đã đặt tour với <strong>TourMate</strong>. Dưới đây là thông tin tour bạn đã thanh toán:</p>
      <div class='info-box'>
        <p><strong>Tên tour:</strong> {invoice.TourName}</p>
        <p><strong>Mô tả:</strong> {invoice.TourDesc}</p>
        <p><strong>Thời gian:</strong> {invoice.StartDate:dd/MM/yyyy} - {invoice.EndDate:dd/MM/yyyy}</p>
        <p><strong>Số lượng người:</strong> {invoice.PeopleAmount}</p>
        <p><strong>Tổng tiền:</strong> {invoice.Price:N0} VND</p>
        <p><strong>SĐT liên hệ:</strong> {invoice.CustomerPhone}</p>
        <p><strong>Ghi chú:</strong> {invoice.Note}</p>
      </div>
      <p>Hướng dẫn viên sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận và hướng dẫn chi tiết.</p>
      <p>Chúc bạn có một chuyến đi tuyệt vời!</p>
    </div>
    <div class='footer'>
      © 2025 TourMate. Mọi quyền được bảo lưu.
    </div>
  </div>
</body>
</html>";
        }

        public string GenerateTourGuideInvoiceEmail(Invoice invoice)
        {
            return $@"
<!DOCTYPE html>
<html lang='vi'>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title>Lịch trình mới - TourMate</title>
  <style>
    body {{
      font-family: 'Segoe UI', Tahoma, sans-serif;
      background-color: #f9fafb;
      margin: 0;
      color: #333;
    }}
    .container {{
      max-width: 600px;
      margin: 30px auto;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      overflow: hidden;
    }}
    .header {{
      background-color: #3b82f6;
      color: #fff;
      text-align: center;
      padding: 20px;
    }}
    .content {{
      padding: 25px 30px;
    }}
    .content h1 {{
      font-size: 20px;
      margin-bottom: 16px;
    }}
    .info-box {{
      background-color: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 15px;
      margin-bottom: 20px;
      border-radius: 5px;
    }}
    .info-box p {{
      margin: 6px 0;
    }}
    .footer {{
      text-align: center;
      font-size: 13px;
      color: #6b7280;
      padding: 16px;
      background-color: #f3f4f6;
    }}
  </style>
</head>
<body>
  <div class='container'>
    <div class='header'>
      <h2>Lịch trình mới được thanh toán</h2>
    </div>
    <div class='content'>
      <h1>Xin chào Hướng Dẫn Viên,</h1>
      <p>Bạn vừa nhận được một lịch trình mới từ khách hàng. Thông tin chi tiết như sau:</p>
      <div class='info-box'>
        <p><strong>Tên tour:</strong> {invoice.TourName}</p>
        <p><strong>Mô tả:</strong> {invoice.TourDesc}</p>
        <p><strong>Thời gian:</strong> {invoice.StartDate:dd/MM/yyyy} - {invoice.EndDate:dd/MM/yyyy}</p>
        <p><strong>Khách hàng:</strong> {invoice.Customer.FullName}</p>
        <p><strong>SĐT khách:</strong> {invoice.CustomerPhone}</p>
        <p><strong>Số người:</strong> {invoice.PeopleAmount}</p>
        <p><strong>Ghi chú từ khách:</strong> {invoice.Note}</p>
      </div>
      <p>Vui lòng chủ động liên hệ với khách hàng và chuẩn bị lịch trình kỹ lưỡng.</p>
      <p>Chúc bạn dẫn tour thành công!</p>
    </div>
    <div class='footer'>
      © 2025 TourMate. Hệ thống quản lý tour hiện đại.
    </div>
  </div>
</body>
</html>";
        }


        public string GenerateSuccessfulPaymentEmail(string fullName, float price, DateTime completeDate, string paymentType)
        {
            return $@"
<!DOCTYPE html>
<html lang='vi'>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title>Xác nhận thanh toán - TourMate</title>
  <style>
    body {{
      margin: 0; padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f9fafb;
      color: #333;
    }}

    .email-container {{
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }}

    .email-header {{
      background-color: #4CAF50;
      text-align: center;
      padding: 25px 20px;
      color: white;
    }}

    .email-header img {{
      max-width: 140px;
      margin-bottom: 10px;
    }}

    .email-header h2 {{
      font-size: 24px;
      font-weight: 500;
      margin: 0;
    }}

    .email-body {{
      padding: 30px 35px;
      font-size: 16px;
      line-height: 1.6;
    }}

    .email-body h1 {{
      font-size: 22px;
      margin-bottom: 16px;
      font-weight: 600;
      color: #111827;
    }}

    .email-body p {{
      margin-bottom: 18px;
    }}

    .highlight {{
      background-color: #f0fdf4;
      padding: 12px 16px;
      border-left: 4px solid #34d399;
      border-radius: 6px;
      margin-bottom: 20px;
    }}

    .payment-info {{
      background-color: #f9fafb;
      padding: 15px 18px;
      border-left: 4px solid #3b82f6;
      border-radius: 6px;
    }}

    .payment-info p {{
      margin: 8px 0;
    }}

    .email-footer {{
      text-align: center;
      font-size: 13px;
      color: #6b7280;
      padding: 20px 30px;
      background-color: #f3f4f6;
      border-top: 1px solid #e5e7eb;
    }}

    @media only screen and (max-width: 600px) {{
      .email-body {{
        padding: 24px 20px;
        font-size: 15px;
      }}
    }}
  </style>
</head>
<body>
  <div class='email-container'>
    <div class='email-header'>
      <img src='https://firebasestorage.googleapis.com/v0/b/badmintoncourtbooking-183b2.appspot.com/o/tourmate%2FLogo.png?alt=media&token=dddca32f-667c-4913-9ccb-0f2d36d6e779' alt='TourMate Logo'>
      <h2>Thanh toán thành công</h2>
    </div>
    <div class='email-body'>
      <h1>Chào {fullName},</h1>
      <p>Chúng tôi rất vui thông báo rằng bạn đã <strong>thanh toán thành công</strong> cho dịch vụ của mình.</p>
      
      <div class='highlight'>
        Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của TourMate! Thông tin chi tiết giao dịch của bạn như sau:
      </div>

      <div class='payment-info'>
        <p><strong>Số tiền:</strong> {price:N0} VND</p>
        <p><strong>Ngày thanh toán:</strong> {completeDate:dd/MM/yyyy HH:mm}</p>
        <p><strong>Hình thức dịch vụ:</strong> {paymentType}</p>
      </div>

      <p>Nếu bạn cần hỗ trợ thêm, đừng ngần ngại liên hệ với chúng tôi qua email hoặc số điện thoại hỗ trợ.</p>
      <p>Trân trọng,<br>Đội ngũ TourMate</p>
    </div>
    <div class='email-footer'>
      © 2025 TourMate. Mọi quyền được bảo lưu.
    </div>
  </div>
</body>
</html>";
        }
     }
}