"use client"

import Image from "next/image"
import Anh1 from "@/public/Anh1.jpg"
import Logo from "@/public/Logo.png"
import "@/styles/globals.css"
import AOS from "aos"
import "aos/dist/aos.css"
import { useEffect } from "react"

const AboutSunday = () => {
  useEffect(() => {
    AOS.init({
      offset: 0,
      delay: 200,
      duration: 1200,
      once: true,
    })
  }, [])

  return (
    <section className="w-full bg-white px-4 md:px-6 lg:px-8 py-16 lg:py-24 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-10"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-10"></div>

      {/* Header */}
      <div className="flex justify-center mb-16 relative z-10">
        <div className="text-center max-w-3xl">
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 inter"
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Thông tin
            </span>{" "}
            về chúng tôi
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed" data-aos="fade-up" data-aos-delay="500">
            Khám phá câu chuyện đằng sau TourMate và sứ mệnh kết nối du khách với những trải nghiệm chân thực
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="relative w-full min-h-[800px] rounded-3xl overflow-hidden shadow-2xl"
        data-aos="zoom-in"
        data-aos-delay="300"
      >
        {/* Background image */}
        <Image
          src={Anh1 || "/placeholder.svg"}
          alt="Thông tin về TourMate"
          fill
          className="object-cover object-center"
          priority
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

        {/* Content Grid */}
        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 grid-cols-1 gap-12 items-center px-6 lg:px-12 py-12 lg:py-16 h-full min-h-[800px]">
          {/* Left Content */}
          <div className="text-white space-y-8">
            <div className="space-y-6">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold charm-regular leading-tight">
                Hành Trình Khám Phá –{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Kết Nối Đam Mê
                </span>
              </h3>

              <div className="space-y-4 text-lg lg:text-xl leading-relaxed text-gray-100">
                <p>
                  TourMate là nền tảng kết nối du lịch bản địa do Tập đoàn Sunday phát triển, với sứ mệnh tái định nghĩa
                  cách du khách trải nghiệm văn hóa và con người tại mỗi điểm đến.
                </p>
                <p>
                  Thông qua mạng lưới TourMate – những người bạn đồng hành bản địa, chúng tôi mang đến những hành trình
                  cá nhân hóa, chân thực và sâu sắc. Tại đây, du khách không chỉ tham quan mà còn được sống, cảm và thấu
                  hiểu cuộc sống địa phương bằng tất cả giác quan và cảm xúc.
                </p>
                <p>
                  Với nền tảng công nghệ vững mạnh và tầm nhìn chiến lược dài hạn, TourMate không ngừng mở rộng hệ sinh
                  thái trải nghiệm – nơi mỗi chuyến đi là một cánh cửa mở ra kết nối văn hóa, giao lưu cộng đồng và lan
                  tỏa những giá trị bản địa bền vững.
                </p>
              </div>
            </div>

            <a
              href="/aboutUs"
              className="inline-flex items-center text-white hover:text-blue-300 transition-colors group text-lg font-semibold"
            >
              <span className="tracking-wide">XEM THÊM</span>
              <svg
                className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Right Content - Card */}
          <div className="flex justify-center items-center w-full">
            <div className="relative bg-white/95 backdrop-blur-md rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/20 w-full max-w-lg">
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl"></div>

              {/* Logo */}
              <div className="flex justify-center mb-8 relative z-10">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl blur-lg opacity-30"></div>
                  <div className="relative bg-white rounded-3xl p-4 shadow-xl">
                    <Image
                      src={Logo || "/placeholder.svg"}
                      alt="Sunday team"
                      width={80}
                      height={80}
                      className="rounded-2xl"
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="text-center space-y-6 relative z-10">
                <h4 className="text-2xl lg:text-3xl font-bold text-gray-900 charm-bold">
                  &quot;Tái định nghĩa{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    trải nghiệm du lịch bản địa
                  </span>
                  &quot;
                </h4>

                <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto"></div>

                <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
                  Chúng tôi là Tập đoàn Sunday. Với tầm nhìn chiến lược và niềm đam mê
                  mãnh liệt với du lịch bản địa, chúng tôi đã phát triển TourMate - nền tảng kết nối du khách với những
                  người bạn đồng hành địa phương, mang đến trải nghiệm văn hóa chân thực và sâu sắc nhất.
                </p>

                <div className="pt-6">
                  <a
                    href="/aboutUs"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
                  >
                    THÔNG TIN THÊM VỀ SUNDAY
                    <svg
                      className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSunday
