using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.MailBody
{
    public class TourGuideInvoiceEmailBody
    {
        public static string GenerateContent(Invoice invoice)
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
<p><strong>Thời gian:</strong> {invoice.StartDate.AddHours(7):dd/MM/yyyy HH:mm} - {invoice.EndDate.AddHours(7):dd/MM/yyyy HH:mm}</p>
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
    }
}
