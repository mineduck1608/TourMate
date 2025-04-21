// components/FeedbackSection.tsx
import Image from 'next/image'

type Feedback = {
  name: string
  date: string
  content: string
  avatar: string
}

const feedbacks: Feedback[] = [
  {
    name: 'NGUYỄN MINH ĐỨC',
    date: '27/09/2023',
    content:
      'Tôi đã sử dụng dịch vụ của công ty và thật sự ấn tượng từ lần đầu tiên. Đội ngũ nhân viên chuyên nghiệp không chỉ giúp tôi đặt lịch một cách nhanh chóng, mà còn mang đến những trải nghiệm du lịch độc đáo.',
    avatar: 'https://img.freepik.com/free-photo/medium-shot-night-portrait_23-2149005431.jpg?t=st=1745244071~exp=1745247671~hmac=fb45920e6b39412c328e5f18823be0296e4d786f0ec27598004e0b4838c34a60&w=740', // Thay bằng path ảnh thật
  },
  {
    name: 'TRẦN NGỌC LINH',
    date: '27/09/2023',
    content:
      'Dịch vụ này đã mở ra cho tôi cánh cửa đến với những hành trình ý nghĩa, giúp tôi khám phá tiềm năng của bản thân. Tôi rất hài lòng và tin tưởng, và chắc chắn sẽ giới thiệu cho bạn bè và người thân.',
    avatar: 'https://img.freepik.com/premium-photo/young-asian-travel-woman-is-enjoying-with-beautiful-place-bangkok-thailand_33799-5152.jpg?w=740', // Thay bằng path ảnh thật
  },
  {
    name: 'NGUYỄN MINH ĐỨC',
    date: '27/09/2023',
    content:
      'Tôi đã sử dụng dịch vụ của công ty và thật sự ấn tượng từ lần đầu tiên. Đội ngũ nhân viên chuyên nghiệp không chỉ giúp tôi đặt lịch một cách nhanh chóng, mà còn mang đến những trải nghiệm du lịch độc đáo.',
    avatar: 'https://img.freepik.com/free-photo/medium-shot-night-portrait_23-2149005431.jpg?t=st=1745244071~exp=1745247671~hmac=fb45920e6b39412c328e5f18823be0296e4d786f0ec27598004e0b4838c34a60&w=740', // Thay bằng path ảnh thật
  },
  {
    name: 'TRẦN NGỌC LINH',
    date: '27/09/2023',
    content:
      'Dịch vụ này đã mở ra cho tôi cánh cửa đến với những hành trình ý nghĩa, giúp tôi khám phá tiềm năng của bản thân. Tôi rất hài lòng và tin tưởng, và chắc chắn sẽ giới thiệu cho bạn bè và người thân.',
    avatar: 'https://img.freepik.com/premium-photo/young-asian-travel-woman-is-enjoying-with-beautiful-place-bangkok-thailand_33799-5152.jpg?w=740', // Thay bằng path ảnh thật
  },
]

export default function FeedbackSection() {
  return (
    <div className="bg-white py-16 px-4 md:px-10">
      <h2 className="text-3xl md:text-4xl font-serif italic text-center mb-12"  data-aos="flip-down">
        Khách hàng nói gì về chúng tôi
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mx-auto" data-aos="flip-up">
        {feedbacks.map((item, idx) => (
          <div key={idx} className="flex flex-col items-start gap-4">
            <div className="flex gap-4 items-start">
  <Image
    src={item.avatar}
    alt={item.name}
    width={60}
    height={60}
    className="rounded-full object-cover aspect-square"
  />
  <div>
    <p className="italic text-gray-700">{item.content}</p>
    <div className="mt-4">
      <p className="font-semibold tracking-wide">{item.name}</p>
      <p className="text-sm text-gray-500">{item.date}</p>
    </div>
  </div>
</div>   
          </div>
        ))}
      </div>
    </div>
  )
}
