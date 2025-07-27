using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Utils
{
    public class EmailBody
    {
        public string BuildResetPasswordEmail(string resetLink)
        {
            return $@"
<!DOCTYPE html>
<html lang=""vi"">
<head>
<meta charset=""UTF-8"" />
<meta name=""viewport"" content=""width=device-width, initial-scale=1"" />
<title>Đặt lại mật khẩu TourMate</title>
<style>
  body, html {{
    margin: 0; padding: 0; height: 100%; width: 100%; background-color: #e0e0e0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #000000;
  }}
  a {{
    color: #ffffff; text-decoration: none;
  }}
  .email-wrapper {{
    margin: 40px auto;
    background-color: #ffffff;
    border-radius: 14px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.1);
    overflow: hidden;
  }}
  .email-header {{
    background-color: lightgray;
    padding: 30px 20px;
    text-align: center;
    color: #000000;
  }}
  .email-header img {{
    max-width: 200px;
    margin-bottom: 15px;
  }}
  .email-header h1 {{
    margin: 0;
    font-weight: 700;
    font-size: 32px;
    letter-spacing: 1px;
  }}
  .email-header p {{
    margin: 8px 0 0;
    font-style: italic;
    font-weight: 500;
    font-size: 18px;
    opacity: 0.85;
  }}
  .email-body {{
    padding: 40px 40px 60px;
    font-size: 17px;
    line-height: 1.5;
  }}
  .email-body p {{
    margin-bottom: 20px;
  }}
  .email-footer {{
    background-color: #e0e0e0;
    color: #555555;
    text-align: center;
    font-size: 13px;
    padding: 20px 30px;
    border-top: 1px solid #dfe3e9;
  }}
  @media only screen and (max-width: 480px) {{
    .email-wrapper {{
      width: 95% !important;
      margin: 20px auto !important;
    }}
    .email-header h1 {{
      font-size: 24px !important;
    }}
    .email-header p {{
      font-size: 14px !important;
    }}
    .email-body {{
      font-size: 15px !important;
      padding: 25px 20px 35px !important;
    }}
    .btn-reset {{
      font-size: 18px !important;
      padding: 14px 30px !important;
    }}
  }}
</style>
</head>
<body>
  <div class=""email-wrapper"" role=""article"" aria-roledescription=""email"" lang=""vi"">
    <header class=""email-header"">
      <img src=""https://firebasestorage.googleapis.com/v0/b/badmintoncourtbooking-183b2.appspot.com/o/tourmate%2FLogo.png?alt=media&token=dddca32f-667c-4913-9ccb-0f2d36d6e779"" alt=""TourMate Logo"" />
    </header>
    <section class=""email-body"">
      <h1>TourMate xin chào,</h1>
      <p>Bạn nhận được email này vì chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản TourMate của bạn. Hãy nhấn nút dưới đây để đặt lại mật khẩu !!!</p>
      <p style=""text-align: center;"">
        <a href=""{resetLink}"" target=""_blank"" rel=""noopener noreferrer""
           style=""
             display: inline-block;
             background-color: black;
             padding: 15px 45px;
             border-radius: 50px;
             font-weight: 700;
             font-size: 20px;
             color: white;
             text-align: center;
             text-decoration: none;
           "">Đặt lại mật khẩu</a>
      </p>
      <p>Nếu bạn không yêu cầu thay đổi mật khẩu, bạn có thể bỏ qua email này.</p>
      <p>Trân trọng,<br />Đội ngũ TourMate</p>
    </section>
    <footer class=""email-footer"">
      © 2025 TourMate. Bản quyền mọi quyền được bảo lưu.
    </footer>
  </div>
</body>
</html>";
        }



        public string GenerateTourGuideApprovalEmail(string fullName, string email, string password, string? response = null)
        {
            string responseSection = string.IsNullOrWhiteSpace(response)
                ? ""
                : $@"
      <p class='response-section' style='background-color: #e2f0fb; border-left: 5px solid #007acc; padding: 15px 20px; border-radius: 6px; margin-top: 20px; color: #004085;'>
        <strong>Phản hồi từ quản trị viên:</strong><br />{response}
      </p>";

            return $@"
<!DOCTYPE html>
<html lang='vi'>
<head>
  <meta charset='UTF-8' />
  <meta name='viewport' content='width=device-width, initial-scale=1' />
  <title>Chấp thuận đơn ứng tuyển - TourMate</title>
  <style>
    body, html {{
      margin: 0; padding: 0; height: 100%; width: 100%;
      background-color: #f5f8fa;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #000000;
    }}
    a {{
      color: #ffffff; text-decoration: none;
    }}
    .email-wrapper {{
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 14px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.05);
      overflow: hidden;
    }}
    .email-header {{
      background-color: #0056b3;
      padding: 30px 20px;
      text-align: center;
      color: #ffffff;
    }}
    .email-header img {{
      max-width: 180px;
      margin-bottom: 15px;
    }}
    .email-body {{
      padding: 40px 40px 60px;
      font-size: 17px;
      line-height: 1.6;
      color: #333333;
    }}
    .email-body h1 {{
      font-size: 26px;
      font-weight: 700;
      margin-bottom: 20px;
    }}
    .email-body p {{
      margin-bottom: 20px;
    }}
    .highlight {{
      background-color: #e2f0d9;
      padding: 10px 15px;
      border-left: 5px solid #28a745;
      border-radius: 6px;
    }}
    .account-info {{
      background-color: #e6f4ff;
      padding: 12px 16px;
      border-left: 5px solid #007bff;
      border-radius: 6px;
      margin-top: 20px;
    }}

    .warning {{
      background-color: #ffe6e6;
      padding: 12px 16px;
      border-left: 5px solid #ff0000;
      border-radius: 6px;
      margin-top: 20px;
    }}
    .response-section {{
      /* optional override */
    }}
    .email-footer {{
      background-color: #f0f4f8;
      color: #555555;
      text-align: center;
      font-size: 13px;
      padding: 20px 30px;
      border-top: 1px solid #dfe3e9;
    }}
    @media only screen and (max-width: 480px) {{
      .email-wrapper {{
        width: 95% !important;
        margin: 20px auto !important;
      }}
      .email-body {{
        font-size: 15px !important;
        padding: 25px 20px 35px !important;
      }}
    }}
  </style>
</head>
<body>
  <div class='email-wrapper' role='article' aria-roledescription='email' lang='vi'>
    <header class='email-header'>
      <img src='https://firebasestorage.googleapis.com/v0/b/badmintoncourtbooking-183b2.appspot.com/o/tourmate%2FLogo.png?alt=media&token=dddca32f-667c-4913-9ccb-0f2d36d6e779' alt='TourMate Logo' />
      <h2>Chúc mừng bạn!</h2>
    </header>
    <section class='email-body'>
      <h1>Đơn ứng tuyển của bạn đã được chấp thuận 🎉</h1>
      <p>Kính gửi <strong>{fullName}</strong>,</p>
      <p>Chúng tôi rất vui mừng thông báo rằng hồ sơ ứng tuyển vị trí <strong>Hướng dẫn viên du lịch</strong> của bạn tại TourMate đã được <strong>chấp thuận</strong>.</p>
      <p class='highlight'>
        Tài khoản của bạn đã được kích hoạt. Bạn có thể đăng nhập để cập nhật lịch trình, thông tin cá nhân và bắt đầu nhận các chuyến đi!
      </p>
      <div class='account-info'>
        <p><strong>Thông tin đăng nhập của bạn:</strong></p>
        <p><strong>Email:</strong> {email}<br />
           <strong>Mật khẩu:</strong> {password}</p>
        <p style='margin-top: 10px; font-style: italic; color: #555;'>Vui lòng đổi mật khẩu sau khi đăng nhập lần đầu để đảm bảo an toàn thông tin.</p>
      </div>

<div class='warning'>
        <p><strong>Chú ý:</strong></p>
        <p style='margin-top: 10px'>Bạn cần cập nhật số tài khoản ngân hàng để được nền tảng thanh toán tiền dịch vụ. Vui lòng truy cập <strong>Menu người dùng -> Thông tin tài khoản</strong> để cập nhật các thông tin cần thiết.</p>
      </div>

      {responseSection}

      <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc hotline hỗ trợ.</p>
      <p>Chúng tôi rất mong chờ được đồng hành cùng bạn trong hành trình sắp tới.</p>
      <p>Trân trọng,<br />
      Đội ngũ TourMate</p>
    </section>
    <footer class='email-footer'>
      © 2025 TourMate. Bản quyền mọi quyền được bảo lưu.
    </footer>
  </div>
</body>
</html>";
        }

        public string GenerateTourGuideRejectionEmail(string fullName, string response)
        {
            return $@"
<!DOCTYPE html>
<html lang='vi'>
<head>
  <meta charset='UTF-8' />
  <meta name='viewport' content='width=device-width, initial-scale=1' />
  <title>Thông báo từ chối đơn ứng tuyển - TourMate</title>
  <style>
    body, html {{
      margin: 0; padding: 0; background-color: #f8d7da; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #721c24;
    }}
    .email-wrapper {{
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 14px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.1);
      overflow: hidden;
    }}
    .email-header {{
      background-color: #f5c6cb;
      padding: 30px 20px;
      text-align: center;
      color: #721c24;
    }}
    .email-body {{
      padding: 40px 40px 60px;
      font-size: 17px;
      line-height: 1.6;
    }}
    .email-body h1 {{
      font-size: 26px;
      font-weight: 700;
      margin-bottom: 20px;
    }}
    .response-section {{
      background-color: #f8d7da;
      border-left: 5px solid #f5c6cb;
      padding: 15px 20px;
      border-radius: 6px;
      margin-top: 20px;
      color: #721c24;
      font-style: italic;
    }}
    .email-footer {{
      background-color: #f4f4f4;
      color: #555555;
      text-align: center;
      font-size: 13px;
      padding: 20px 30px;
      border-top: 1px solid #dfe3e9;
    }}
    @media only screen and (max-width: 480px) {{
      .email-wrapper {{
        width: 95% !important;
        margin: 20px auto !important;
      }}
      .email-body {{
        font-size: 15px !important;
        padding: 25px 20px 35px !important;
      }}
    }}
  </style>
</head>
<body>
  <div class='email-wrapper' role='article' aria-roledescription='email' lang='vi'>
    <header class='email-header'>
      <h2>Thông báo từ chối đơn ứng tuyển</h2>
    </header>
    <section class='email-body'>
      <h1>Kính gửi {fullName},</h1>
      <p>Chúng tôi rất tiếc phải thông báo rằng hồ sơ ứng tuyển vị trí <strong>Hướng dẫn viên du lịch</strong> của bạn tại TourMate chưa được chấp nhận.</p>
      <div class='response-section'>
        <strong>Lý do từ chối:</strong><br />
        {response}
      </div>
      <p>Cảm ơn bạn đã quan tâm và gửi hồ sơ cho chúng tôi. Chúc bạn sớm tìm được vị trí phù hợp.</p>
      <p>Trân trọng,<br />Đội ngũ TourMate</p>
    </section>
    <footer class='email-footer'>
      © 2025 TourMate. Bản quyền mọi quyền được bảo lưu.
    </footer>
  </div>
</body>
</html>";
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


        public string GenerateSuccessfulPaymentEmail(string fullName, float price, DateTime createdAt, string paymentType)
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
