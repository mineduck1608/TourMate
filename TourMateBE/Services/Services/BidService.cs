using Repositories.Models;
using Repositories.IRepositories;
using Repositories.ResponseModels;
using Services.IServices;

namespace Services.Services
{
    public class BidService : IBidService
    {
        private IBidRepository BidRepository;

        public BidService(IBidRepository bidRepository)
        {
            BidRepository = bidRepository ?? throw new ArgumentNullException(nameof(bidRepository));
        }

        public Bid GetBid(int id)
        {
            return BidRepository.GetById(id);
        }

        public IEnumerable<Bid> GetAll(int pageSize, int pageIndex)
        {
            return BidRepository.GetAll(pageSize, pageIndex);
        }

        public async Task<bool> CreateBid(Bid bid)
        {
            return await BidRepository.CreateAsync(bid);
        }

        public async Task<bool> UpdateBid(Bid bid)
        {
            return await BidRepository.UpdateAsync(bid);
        }

        public async Task<bool> DeleteBid(int id)
        {
            return await BidRepository.RemoveAsync(id);
        }
        public async Task<PagedResult<BidListResult>> GetBidsOfTourBid(int tourBid, int pageSize, int pageIndex)
        {
            return await BidRepository.GetBidsOfTourBid(tourBid, pageSize, pageIndex);
        }
        public async Task<bool> AcceptBid(int bidId)
        {
            return await BidRepository.AcceptBid(bidId);
        }

        public string GenerateBidNotificationEmail(string areaName, string customerName)
        {
            return $@"
<!DOCTYPE html>
<html lang='vi'>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title>Yêu cầu bid mới - TourMate</title>
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
      <h2>Yêu cầu bid mới</h2>
    </div>
    <div class='content'>
      <h1>Chào hướng dẫn viên,</h1>
      <p>Chúng tôi xin thông báo rằng đã có một yêu cầu bid mới của khách hàng <strong>{customerName}</strong> tại khu vực bạn đang phụ trách:</p>
      <div class='info-box'>
        <p><strong>Khu vực:</strong> {areaName}</p>
        <p>Hệ thống đang chờ các hướng dẫn viên phù hợp gửi báo giá để khách hàng lựa chọn.</p>
      </div>
      <p>Vui lòng truy cập hệ thống đấu giá của <strong>TourMate</strong> ngay để xem chi tiết và gửi báo giá.</p>
      <p>Xin cảm ơn sự hợp tác của bạn!</p>
    </div>
    <div class='footer'>
      © 2025 TourMate. Kết nối khách hàng và hướng dẫn viên chuyên nghiệp.
    </div>
  </div>
</body>
</html>";
        }

    }
}