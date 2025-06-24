"use client"

import Image from "next/image"
import { Star, Quote } from "lucide-react"
import AOS from "aos"
import { useEffect } from "react"

type Feedback = {
  name: string
  date: string
  content: string
  avatar: string
  rating?: number
  location?: string
}

const feedbacks: Feedback[] = [
  {
    name: "NGUYỄN MINH ĐỨC",
    date: "27/09/2023",
    content:
      "Tôi đã sử dụng dịch vụ của công ty và thật sự ấn tượng từ lần đầu tiên. Đội ngũ nhân viên chuyên nghiệp không chỉ giúp tôi đặt lịch một cách nhanh chóng, mà còn mang đến những trải nghiệm du lịch độc đáo.",
    avatar:
      "https://img.freepik.com/free-photo/medium-shot-night-portrait_23-2149005431.jpg?t=st=1745244071~exp=1745247671~hmac=fb45920e6b39412c328e5f18823be0296e4d786f0ec27598004e0b4838c34a60&w=740",
    rating: 5,
    location: "Hà Nội",
  },
  {
    name: "TRẦN NGỌC LINH",
    date: "27/09/2023",
    content:
      "Dịch vụ này đã mở ra cho tôi cánh cửa đến với những hành trình ý nghĩa, giúp tôi khám phá tiềm năng của bản thân. Tôi rất hài lòng và tin tưởng, và chắc chắn sẽ giới thiệu cho bạn bè và người thân.",
    avatar:
      "https://img.freepik.com/premium-photo/young-asian-travel-woman-is-enjoying-with-beautiful-place-bangkok-thailand_33799-5152.jpg?w=740",
    rating: 5,
    location: "TP.HCM",
  },
  {
    name: "LÊ VĂN HOÀNG",
    date: "15/10/2023",
    content:
      "Chuyến đi Sapa cùng hướng dẫn viên địa phương thật tuyệt vời. Tôi đã được trải nghiệm văn hóa bản địa một cách chân thực nhất. Cảm ơn TourMate đã kết nối tôi với những người bạn tuyệt vời.",
    avatar: "https://thanhnien.mediacdn.vn/uploaded/ngocthanh/2021_04_16/chup-anh-du-lich-3_QMXM.jpg",
    rating: 5,
    location: "Đà Nẵng",
  },
  {
    name: "PHẠM THU HƯƠNG",
    date: "02/11/2023",
    content:
      "Ứng dụng rất dễ sử dụng và tiện lợi. Tôi đã tìm được hướng dẫn viên phù hợp cho chuyến đi Hội An. Giá cả hợp lý và dịch vụ chất lượng cao. Chắc chắn sẽ sử dụng lại trong tương lai.",
    avatar: "https://media-cdn-v2.laodong.vn/storage/newsportal/2024/5/30/1346707/Hoi-An-11.jpg",
    rating: 4,
    location: "Hải Phòng",
  },
]

export default function FeedbackSection() {
  useEffect(() => {
    AOS.init({
      offset: 0,
      delay: 200,
      duration: 1200,
      once: true,
    })
  }, [])

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16" data-aos="flip-down">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Khách hàng
            </span>{" "}
            nói gì về chúng tôi
          </h2>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Những phản hồi chân thực từ khách hàng đã trải nghiệm dịch vụ của TourMate
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" data-aos="flip-up">
          {feedbacks.map((item, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 hover:scale-105"
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            >
              {/* Quote decoration */}
              <div className="relative p-6 pb-0">
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote className="h-12 w-12 text-blue-600" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 transition-colors ${
                        i < (item.rating || 5) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-semibold text-gray-700">{item.rating || 5}.0</span>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6">
                <blockquote className="text-gray-700 leading-relaxed mb-6 line-clamp-4 text-sm lg:text-base">
                  &quot;{item.content}&quot;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <Image
                      src={item.avatar || "/placeholder.svg"}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="relative w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {item.location && (
                        <>
                          <span>{item.location}</span>
                          <span>•</span>
                        </>
                      )}
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover effect gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16" data-aos="fade-up" data-aos-delay="600">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 lg:p-12 border border-blue-100">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Bạn cũng muốn chia sẻ trải nghiệm của mình?
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              Hãy để lại đánh giá và giúp những du khách khác có những lựa chọn tốt nhất
            </p>
            <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 group">
              Viết đánh giá của bạn
              <svg
                className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
