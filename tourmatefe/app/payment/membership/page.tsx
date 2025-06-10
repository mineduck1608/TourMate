"use client"

import MegaMenu from "@/components/mega-menu"
import { HeroSection } from "./hero-section"
import { PricingCard } from "./pricing-card"
import { ComparisonTable } from "./comparison-table"
import { Testimonials } from "./testimonials"
import { FAQSection } from "./fap-section"
import Footer from "@/components/Footer"
import Link from "next/link"



const pricingPlans = [
  {
    title: "Trial",
    description: "Phù hợp cho hướng dẫn viên mới bắt đầu muốn thử nghiệm nền tảng",
    price: 99000,
    period: "tháng",
    features: [
      "Hồ sơ hướng dẫn viên cơ bản",
      "Hỗ trợ 24/7",
      "Kết nối với khách hàng",
      "Hỗ trợ qua email",
      "Truy cập cộng đồng hướng dẫn viên",
    ],
    id: 1
  },
  {
    title: "TourMate Guide Plus",
    description: "Dành cho hướng dẫn viên muốn phát triển nghiệp vụ và tăng thu nhập",
    price: 1560000,
    originalPrice: 2000000,
    period: "1 năm",
    features: [
      "Tất cả tính năng gói Trial",
      "Chat trực tiếp với khách hàng",
      "Nhận thanh toán online",
      "Tạo portfolio tour chuyên nghiệp",
      "Tích hợp mạng xã hội",
      "Hỗ trợ ưu tiên",
    ],
    isPopular: true,
    discount: "Tiết kiệm 22%",
    id: 2
  },
  {
    title: "TourMate Guide Pro",
    description: "Giải pháp toàn diện cho hướng dẫn viên chuyên nghiệp và doanh nghiệp",
    price: 2100000,
    originalPrice: 3000000,
    period: "năm",
    features: [
      "Tất cả tính năng gói Trial và Plus",
      "Quảng cáo ưu tiên trên nền tảng",
      "Phân tích thống kê chi tiết",
      "Email marketing tự động",
      "Hỗ trợ 24/7",
      "Chứng chỉ hướng dẫn viên",
      "Báo cáo doanh thu chi tiết",
      "Tăng tần xuất giới thiệu",
    ],
    discount: "Tiết kiệm 30%",
    id: 3
  },
]

export default function MembershipPage() {
  return (
    <>
      <MegaMenu />

      {/* Clean background with subtle gradient */}
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white">
        <div className="container mx-auto px-4 py-16">
          <HeroSection />

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {pricingPlans.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>

          <ComparisonTable />
          <Testimonials />
          <FAQSection />

          {/* CTA Section */}
          <div className="text-center mt-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-12 shadow-xl">
            <h2 className="text-3xl font-bold text-white mb-4">Sẵn sàng bắt đầu hành trình mới?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Tham gia cùng hàng nghìn hướng dẫn viên đã thay đổi cuộc sống và sự nghiệp của họ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                Bắt đầu dùng thử miễn phí
              </Link>
              <Link href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Liên hệ tư vấn
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
