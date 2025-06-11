import { Check, X } from "lucide-react"

const features = [
  {
    category: "Tính năng cơ bản",
    items: [
      { name: "Hồ sơ hướng dẫn viên chuyên nghiệp", basic: true, premium: true, pro: true },
      { name: "Tìm kiếm và kết nối khách hàng", basic: true, premium: true, pro: true },
      { name: "Quản lý lịch trình tour", basic: true, premium: true, pro: true },
      { name: "Chat trực tiếp với khách hàng", basic: false, premium: true, pro: true },
      { name: "Nhận thanh toán online", basic: false, premium: true, pro: true },
    ],
  },
  {
    category: "Công cụ marketing",
    items: [
      { name: "Quảng cáo ưu tiên trên nền tảng", basic: false, premium: true, pro: true },
      { name: "Phân tích thống kê chi tiết", basic: false, premium: true, pro: true },
      { name: "Tạo portfolio tour chuyên nghiệp", basic: false, premium: true, pro: true },
      { name: "Quảng cáo Google & Facebook", basic: false, premium: true, pro: true },
      { name: "Email marketing tự động", basic: false, premium: false, pro: true },
      { name: "Quảng cáo bằng Banner", basic: false, premium: false, pro: true },
    ],
  },
  {
    category: "Hỗ trợ & Đào tạo",
    items: [
      { name: "Tạo video quảng cáo xuất hiện cùng Influencer", basic: false, premium: true, pro: true },
      { name: "Hỗ trợ 24/7", basic: false, premium: true, pro: true },
      { name: "Hỗ trợ ưu tiên", basic: false, premium: true, pro: true },
      { name: "Đào tạo nâng cao kỹ năng hướng dẫn", basic: false, premium: false, pro: true },
      { name: "Chứng chỉ hướng dẫn viên", basic: false, premium: false, pro: true },
      { name: "Được chủ động kết nối với khách hàng", basic: false, premium: false, pro: true },
    ],
  },
]

export function ComparisonTable() {
  return (
    <div className="mt-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">So sánh chi tiết các gói</h2>
        <p className="text-gray-600">Tìm hiểu đầy đủ những gì bạn nhận được với mỗi gói membership</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="grid grid-cols-4 gap-4 p-6 bg-gray-50 border-b border-gray-200">
          <div className="font-semibold text-gray-900">Tính năng</div>
          <div className="text-center font-semibold text-gray-900">Cơ bản</div>
          <div className="text-center font-semibold text-gray-900">Chuyên nghiệp</div>
          <div className="text-center font-semibold text-gray-900">Cao cấp</div>
        </div>

        {features.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <div className="px-6 py-4 bg-gray-100">
              <h3 className="font-semibold text-gray-900">{category.category}</h3>
            </div>
            {category.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="grid grid-cols-4 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="text-gray-700 text-sm">{item.name}</div>
                <div className="text-center">
                  {item.basic ? (
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  )}
                </div>
                <div className="text-center">
                  {item.premium ? (
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  )}
                </div>
                <div className="text-center">
                  {item.pro ? (
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
