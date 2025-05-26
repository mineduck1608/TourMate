using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using MailKit.Net.Smtp;
using MimeKit;
using System.Text;
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

            emailMessage.From.Add(new MailboxAddress(
                _configuration["EmailSettings:FromName"],
                _configuration["EmailSettings:FromEmail"]));
            emailMessage.To.Add(new MailboxAddress("", toEmail));
            emailMessage.Subject = subject;

            // Bạn có thể set body dạng plain text hoặc html
            emailMessage.Body = new TextPart("html") { Text = body };

            using var client = new SmtpClient();

            // Kết nối SMTP server
            await client.ConnectAsync(
                _configuration["EmailSettings:SmtpHost"],
                int.Parse(_configuration["EmailSettings:SmtpPort"]),
                MailKit.Security.SecureSocketOptions.StartTls);

            // Đăng nhập SMTP
            await client.AuthenticateAsync(
                _configuration["EmailSettings:SmtpUser"],
                _configuration["EmailSettings:SmtpPass"]);

            await client.SendAsync(emailMessage);
            await client.DisconnectAsync(true);
        }
    }
}
