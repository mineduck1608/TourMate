using Repositories.Models;
using Repositories.Repository;
using Repositories.ResponseModels;

namespace Services
{
    public interface IFeedbackService
    {
        Task<Feedback> GetFeedback(int id);
        Task<Feedback> GetFeedbackContainInvoice(int id);
        Task<Feedback> GetFeedbackByInvoice(int id);

        IEnumerable<Feedback> GetAll(int pageSize, int pageIndex);
        Task<Feedback> CreateFeedback(Feedback feedback);
        Task<bool> UpdateFeedback(Feedback feedback);
        Task<bool> DeleteFeedback(int id);
        string GenerateTourGuideFeedbackEmail(Feedback feedback);
        Task<PaginatedFeedbackResponse> GetTourGuideFeedbacksPublicAsync(int tourGuideId, int page, int pageSize);
    }

    public class FeedbackService : IFeedbackService
    {
        private FeedbackRepository FeedbackRepository { get; set; } = new();

       public async Task<PaginatedFeedbackResponse> GetTourGuideFeedbacksPublicAsync(int tourGuideId, int page, int pageSize)
        {
            // Validate input parameters
            if (tourGuideId <= 0)
                throw new ArgumentException("Tour Guide ID phải lớn hơn 0");

            if (page <= 0)
                throw new ArgumentException("Page phải lớn hơn 0");

            if (pageSize <= 0 || pageSize > 100)
                throw new ArgumentException("Page size phải từ 1 đến 100");

            // Get feedbacks from repository
            var feedbacks = await FeedbackRepository.GetTourGuideFeedbacksAsync(tourGuideId, page, pageSize);
            var totalCount = await FeedbackRepository.GetTourGuideFeedbackCountAsync(tourGuideId);

            // Calculate pagination info
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            // Map to DTOs
            var feedbackDtos = feedbacks.Select(f => new PublicFeedbackDto
            {
                FeedbackId = f.FeedbackId,
                CustomerId = f.CustomerId,
                TourGuideId = f.TourGuideId,
                CreatedDate = f.CreatedDate,
                Content = f.Content,
                Rating = f.Rating,
                InvoiceId = f.InvoiceId ?? 0,
                CustomerName = f.Customer.FullName,
                CustomerAvatar = f.Customer.Image,
                CustomerAccountId = f.Customer?.AccountId,
                TourName = f.Invoice?.TourName,
                StartDate = f.Invoice?.StartDate
            }).ToList();

            return new PaginatedFeedbackResponse
            {
                Result = feedbackDtos,
                TotalCount = totalCount,
                TotalPage = totalPages,
                CurrentPage = page,
                PageSize = pageSize
            };
        }

        public async Task<Feedback> GetFeedback(int id)
        {
            return await FeedbackRepository.GetByIdAsync(id);
        }

        public async Task<Feedback> GetFeedbackContainInvoice(int id)
        {
            return await FeedbackRepository.GetByIdContainInvoice(id);
        }

        public async Task<Feedback> GetFeedbackByInvoice(int id)
        {
            return await FeedbackRepository.GetByInvoice(id);
        }

        public IEnumerable<Feedback> GetAll(int pageSize, int pageIndex)
        {
            return FeedbackRepository.GetAll(pageSize, pageIndex);
        }

        public async Task<Feedback> CreateFeedback(Feedback feedback)
        {
            return await FeedbackRepository.CreateAndReturnAsync(feedback);
        }

        public async Task<bool> UpdateFeedback(Feedback feedback)
        {
            return await FeedbackRepository.UpdateAsync(feedback);
        }

        public async Task<bool> DeleteFeedback(int id)
        {
            await FeedbackRepository.RemoveAsync(id);
            return true;
        }

        public string GenerateTourGuideFeedbackEmail(Feedback feedback)
        {
            return $@"
<!DOCTYPE html>
<html lang='vi'>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title>Thông báo phản hồi mới - TourMate</title>
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
      border-left: 4px solid #60a5fa;
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
      <h2>Bạn vừa nhận được một phản hồi mới</h2>
    </div>
    <div class='content'>
      <h1>Chào {feedback.TourGuide.FullName},</h1>
      <p>Bạn vừa nhận được một phản hồi từ khách hàng <strong>{feedback.Customer.FullName}</strong> về tour mà bạn đã hướng dẫn. Dưới đây là nội dung phản hồi:</p>
      <div class='info-box'>
        <p><strong>Ngày phản hồi:</strong> {feedback.CreatedDate.AddHours(7):dd/MM/yyyy HH:mm}</p>
        <p><strong>Đánh giá:</strong> {feedback.Rating}/5 sao</p>
        {(feedback.Content != null ? $"<p><strong>Nội dung:</strong > #{feedback.Content}</p>" : "")}
        {(feedback.Invoice.InvoiceId != null ? $"<p><strong>Mã chuyến đi:</strong> #{feedback.Invoice.InvoiceId}</p>" : "")}
        {(feedback.Invoice.TourName != null ? $"<p><strong>Tên chuyến đi:</strong> #{feedback.Invoice.TourName}</p>" : "")}
      </div>
      <p>Hãy xem xét phản hồi này để nâng cao chất lượng dịch vụ trong tương lai.</p>
      <p>Cảm ơn bạn đã đồng hành cùng <strong>TourMate</strong>!</p>
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