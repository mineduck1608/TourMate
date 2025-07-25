namespace TourMate.MailBody
{
    public class TourGuideRejectedEmailBody
    {
        public static string GenerateContent(string fullName, string response)
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
    }
}
