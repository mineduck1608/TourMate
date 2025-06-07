"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const faqs = [
  {
    question: "Tôi có thể hủy gói membership bất cứ lúc nào không?",
    answer:
      "Có, bạn có thể hủy gói membership bất cứ lúc nào. Chúng tôi không ràng buộc hợp đồng dài hạn và bạn sẽ vẫn có quyền truy cập đến hết thời gian đã thanh toán.",
  },
  {
    question: "Có được hoàn tiền nếu không hài lòng không?",
    answer:
      "Chúng tôi có chính sách hoàn tiền 100% trong vòng 30 ngày đầu tiên nếu bạn không hài lòng với dịch vụ, không cần lý do.",
  },
  {
    question: "Tôi có thể nâng cấp gói trong quá trình sử dụng không?",
    answer:
      "Hoàn toàn có thể! Bạn có thể nâng cấp lên gói cao hơn bất cứ lúc nào và chỉ cần trả phần chênh lệch theo thời gian còn lại.",
  },
  {
    question: "Các khóa học có được cập nhật thường xuyên không?",
    answer:
      "Có, chúng tôi cập nhật nội dung khóa học hàng tháng dựa trên xu hướng du lịch mới và phản hồi từ cộng đồng hướng dẫn viên.",
  },
  {
    question: "Tôi có thể sử dụng trên nhiều thiết bị không?",
    answer:
      "Có, tài khoản của bạn có thể đăng nhập và sử dụng trên nhiều thiết bị khác nhau như điện thoại, máy tính bảng và laptop.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="mt-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Câu hỏi thường gặp</h2>
        <p className="text-gray-600">Những thắc mắc phổ biến về membership</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <Card key={index} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <button
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
