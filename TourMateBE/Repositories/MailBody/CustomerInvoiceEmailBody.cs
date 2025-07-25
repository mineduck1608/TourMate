using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.MailBody
{
    public class CustomerInvoiceEmailBody
    {
        public static string GenerateContent(Invoice invoice)
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
<p><strong>Thời gian:</strong> {invoice.StartDate.AddHours(7):dd/MM/yyyy HH:mm} - {invoice.EndDate.AddHours(7):dd/MM/yyyy HH:mm}</p>
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
    }
}
