// pages/api/news.ts
import type { NextApiRequest, NextApiResponse } from 'next'

const allNews = [
  {
    id: 1,
    title: 'Hướng dẫn viên địa phương tại Nha Trang chia sẻ những lời khuyên của họ',
    description: 'Tôi dành cả ngày để khám phá các hòn đảo tuyệt đẹp như Hòn Mun, Hòn Tằm...',
    imageUrl: 'https://your-cdn.com/nha-trang.jpg',
    date: '27-02-2025',
  },
  {
    id: 2,
    title: 'Khám phá nét đẹp hoài cổ tại Hội An',
    description: 'Những ngôi nhà tường vàng phủ rêu, dòng sông Hoài lững lờ trôi...',
    imageUrl: 'https://your-cdn.com/hoi-an.jpg',
    date: '26-02-2025',
  },
  {
    id: 3,
    title: 'Khám phá ẩm thực địa phương tại Thủ đô Hà Nội',
    description: 'Đi dạo quanh hồ Gươm, ghé thăm Văn Miếu, thưởng thức phở nóng hổi...',
    imageUrl: 'https://your-cdn.com/ha-noi.jpg',
    date: '25-02-2025',
  },
  {
    id: 4,
    title: 'Trải nghiệm miền Tây sông nước',
    description: 'Đi chợ nổi, chèo xuồng và thưởng thức trái cây miệt vườn...',
    imageUrl: 'https://your-cdn.com/mien-tay.jpg',
    date: '24-02-2025',
  },
  // thêm nhiều tin nữa nếu muốn
]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const page = parseInt(req.query.page as string) || 1
  const pageSize = 3

  const start = (page - 1) * pageSize
  const end = start + pageSize

  const items = allNews.slice(start, end)
  const hasMore = end < allNews.length

  res.status(200).json({ items, hasMore })
}
