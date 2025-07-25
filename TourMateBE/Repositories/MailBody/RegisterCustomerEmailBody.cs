namespace TourMate.MailBody
{
    public class RegisterCustomerEMailBody
    {
        public static string GenerateContent(string fullName, string email)
        {
            return $@"
<!DOCTYPE html>
<html lang='vi'>
<head>
  <meta charset='UTF-8' />
  <meta name='viewport' content='width=device-width, initial-scale=1' />
  <title>Chào mừng đến với TourMate</title>
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
      <h2>Chào mừng bạn đến với TourMate!</h2>
    </header>
    <section class='email-body'>
      <h1>Xin chào {fullName},</h1>
      <p>Cảm ơn bạn đã đăng ký tài khoản tại TourMate.</p>
      
      <div class='highlight'>
        Tài khoản của bạn đã được tạo thành công. Bạn có thể bắt đầu khám phá và đặt các tour du lịch phù hợp với nhu cầu của mình ngay bây giờ!
      </div>

      <div class='account-info'>
        <p><strong>Thông tin tài khoản của bạn:</strong></p>
        <p><strong>Email đăng nhập:</strong> {email}</p>
      </div>

      <p>Để bảo mật tài khoản, vui lòng không chia sẻ thông tin đăng nhập với bất kỳ ai.</p>
      <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi qua email hỗ trợ hoặc hotline.</p>
      <p>Chúc bạn có những trải nghiệm du lịch tuyệt vời cùng TourMate!</p>
      <p>Trân trọng,<br />
      Đội ngũ TourMate</p>
    </section>
    <footer class='email-footer'>
      © {DateTime.Now.Year} TourMate. Bản quyền mọi quyền được bảo lưu.
    </footer>
  </div>
</body>
</html>";
        }
    }
}
