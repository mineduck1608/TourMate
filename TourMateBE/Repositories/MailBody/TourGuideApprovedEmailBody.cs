namespace TourMate.MailBody
{
    public class TourGuideApprovedEmailBody
    {
        public static string GenerateContent(string fullName, string email, string password, string? response = null)
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

    }
}
