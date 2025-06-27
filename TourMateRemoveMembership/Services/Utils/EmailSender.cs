using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using MimeKit;
using MimeKit.Utils;
using System;
using System.Threading.Tasks;

namespace Services.Utils
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string toEmail, string subject, string body);
    }

    public class EmailSender : IEmailSender
    {
        private readonly IConfiguration _configuration;

        public EmailSender(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var emailMessage = new MimeMessage();

            // From email (tên + địa chỉ)
            emailMessage.From.Add(new MailboxAddress(
                _configuration["EmailSettings:FromName"],
                _configuration["EmailSettings:FromEmail"]));

            // To email (bạn có thể thêm tên người nhận nếu có)
            emailMessage.To.Add(new MailboxAddress("", toEmail));

            emailMessage.Subject = subject;

            // Thiết lập ngày gửi và messageId rõ ràng
            emailMessage.Date = DateTimeOffset.Now;
            emailMessage.MessageId = MimeUtils.GenerateMessageId();

            // Tạo body mail với cả text và html để đảm bảo hiển thị tốt trên mọi client
            var builder = new BodyBuilder
            {
                HtmlBody = body,
                TextBody = "Bạn nhận được email này từ hệ thống TourMate. Nếu không xem được nội dung HTML, vui lòng xem phần này."
            };
            emailMessage.Body = builder.ToMessageBody();

            using var client = new SmtpClient();

            try
            {
                // Kết nối tới SMTP server, port và ssl/tls tùy cấu hình của bạn
                await client.ConnectAsync(
                    _configuration["EmailSettings:SmtpHost"],
                    int.Parse(_configuration["EmailSettings:SmtpPort"]),
                    MailKit.Security.SecureSocketOptions.StartTls);

                // Đăng nhập SMTP
                await client.AuthenticateAsync(
                    _configuration["EmailSettings:SmtpUser"],
                    _configuration["EmailSettings:SmtpPass"]);

                // Gửi mail
                await client.SendAsync(emailMessage);

                // Ngắt kết nối
                await client.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                // Log lỗi (bạn có thể thay thế bằng logging framework)
                Console.WriteLine("Lỗi gửi mail: " + ex.Message);
                throw;
            }
        }
    }
}
