using System.Net;
using System.Net.Mail;

namespace gkb_service.Controllers.Mail_service
{
    public class EmailOtpService
    {
        private readonly IConfiguration _configuration;
        private readonly string _mail;
        private readonly string _mailpassword;

        public EmailOtpService(IConfiguration configuration)
        {
            _configuration = configuration;
            _mail = _configuration.GetValue<string>("EmailSettings:SendMail");
            _mailpassword = _configuration.GetValue<string>("EmailSettings:AppPassword");
        }

        public Task<long> generateAndSendOtp(string recipientEmail)
        {
            // Generate a random 6-digit OTP
            var otp = new Random().Next(100000, 999999).ToString();
            return SendOtpEmail(recipientEmail, otp);
        }

        public async Task<long> SendOtpEmail(string recipientEmail, string otp)
        {
            try
            {
                using (var client = new SmtpClient("smtp.gmail.com", 587))
                {
                    client.Credentials = new NetworkCredential(_mail, _mailpassword);
                    client.EnableSsl = true;
                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(_mail),
                        Subject = "Sanp Dough - Generate OTP Code 📱🔢",
                        Body = $"Your OTP code is: {otp}",
                        IsBodyHtml = false,
                    };
                    mailMessage.To.Add(recipientEmail);
                    await client.SendMailAsync(mailMessage);
                    return Convert.ToInt64(otp); // Success
                }
            }
            catch (Exception ex)
            {
                // Handle exceptions (e.g., log the error)
                Console.WriteLine($"Error sending email: {ex.Message}");
                return 0; // Failure
            }
        }
    }
}
