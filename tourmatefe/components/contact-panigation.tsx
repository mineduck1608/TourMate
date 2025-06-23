"use client"

import Link from "next/link"
import { Mail, Phone, ArrowRight, Users, MapPin, Clock } from "lucide-react"
import AOS from "aos"
import { useEffect } from "react"

export default function ContactPagination() {
  useEffect(() => {
    AOS.init({
      offset: 0,
      delay: 200,
      duration: 1200,
      once: true,
    })
  }, [])

  return (
    <section className="relative py-20 overflow-hidden" data-aos="fade-up" data-aos-anchor-placement="top-bottom">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/premium-photo/scenic-view-rocks-against-sky_1048944-27185067.jpg?w=1380')",
        }}
      />
      {/* Light overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Main heading */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight drop-shadow-2xl">
              Kết nối với hướng dẫn viên địa phương
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mt-4 drop-shadow-lg">
                dễ dàng hơn bao giờ hết
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-white leading-relaxed max-w-4xl mx-auto drop-shadow-lg">
              Khám phá hệ sinh thái trải nghiệm TourMate - nơi mỗi chuyến đi là cánh cửa mở ra kết nối văn hóa, giao lưu
              cộng đồng và lan tỏa những giá trị bản địa bền vững. Hãy để chúng tôi kết nối bạn với những người bạn đồng
              hành địa phương.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 text-lg backdrop-blur-sm"
            >
              <Mail className="w-6 h-6" />
              <span>Liên hệ ngay</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="tel:+84123456789"
              className="group inline-flex items-center gap-3 bg-white/90 backdrop-blur-md text-gray-900 hover:bg-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 text-lg shadow-2xl border border-white/50"
            >
              <Phone className="w-6 h-6" />
              <span>Gọi điện tư vấn</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 border-t border-white/30">
            <div className="text-center group">
              <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 hover:bg-white/30 transition-all duration-300 group-hover:scale-105 shadow-2xl">
                <Clock className="w-12 h-12 text-blue-400 mx-auto mb-4 drop-shadow-lg" />
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">24/7</div>
                <div className="text-white/90 text-lg drop-shadow-md">Hỗ trợ khách hàng</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 hover:bg-white/30 transition-all duration-300 group-hover:scale-105 shadow-2xl">
                <Users className="w-12 h-12 text-green-400 mx-auto mb-4 drop-shadow-lg" />
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">500+</div>
                <div className="text-white/90 text-lg drop-shadow-md">Hướng dẫn viên chuyên nghiệp</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 hover:bg-white/30 transition-all duration-300 group-hover:scale-105 shadow-2xl">
                <MapPin className="w-12 h-12 text-purple-400 mx-auto mb-4 drop-shadow-lg" />
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">50+</div>
                <div className="text-white/90 text-lg drop-shadow-md">Điểm đến hấp dẫn</div>
              </div>
            </div>
          </div>

          {/* Additional info */}
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/30 max-w-3xl mx-auto shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">Tại sao chọn TourMate?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1 drop-shadow-md">Hướng dẫn viên được xác thực</h4>
                  <p className="text-white/90 text-sm drop-shadow-sm">
                    Tất cả hướng dẫn viên đều được kiểm tra kỹ lưỡng
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1 drop-shadow-md">Giá cả minh bạch</h4>
                  <p className="text-white/90 text-sm drop-shadow-sm">Không có phí ẩn, giá cả rõ ràng từ đầu</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1 drop-shadow-md">Trải nghiệm cá nhân hóa</h4>
                  <p className="text-white/90 text-sm drop-shadow-sm">Tour được thiết kế theo sở thích của bạn</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1 drop-shadow-md">Hỗ trợ 24/7</h4>
                  <p className="text-white/90 text-sm drop-shadow-sm">Luôn sẵn sàng hỗ trợ bạn mọi lúc mọi nơi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
