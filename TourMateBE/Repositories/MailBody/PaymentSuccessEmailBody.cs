using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.MailBody
{
    public class PaymentSuccessEmailBody
    {
        public static string GenerateContent(string fullName, float price, DateTime createdAt, string paymentType)
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
<p><strong>Ngày thanh toán:</strong> {createdAt.AddHours(7):dd/MM/yyyy HH:mm}</p>
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
