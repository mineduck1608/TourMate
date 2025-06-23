import React, { useEffect } from "react";
import AOS from "aos";
import 'aos/dist/aos.css';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

export default function ContactText() {
  useEffect(() => {
    AOS.init({
      offset: 0,
      delay: 200,
      duration: 1200,
      once: true,
    });
  }, []);

  return (
    <section
      className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 relative overflow-hidden"
      data-aos="fade-in"
      data-aos-delay="400"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="mx-auto py-20 px-4 sm:px-5 lg:px-20 relative z-10">
        <div className="flex flex-col space-y-20">

          {/* Carousel Section */}
          <div className="relative">
            <Carousel
              plugins={[
                Autoplay({
                  delay: 4000,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent>
                <CarouselItem>
                  <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                    <img
                      src="https://media.vietnamplus.vn/images/7255a701687d11cb8c6bbc58a6c807853659c4f5e6c18951e9d585356e8f856798b4b711ae88fece3a45233417a3d845a74f6b1bfe70b3203772c7979020cefa/99Thuyen_hoa.jpg"
                      alt="Travel 1"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                        <h3 className="text-3xl lg:text-4xl font-bold mb-3">Lễ hội truyền thống</h3>
                        <p className="text-lg lg:text-xl opacity-90 leading-relaxed">
                          Trải nghiệm những lễ hội đầy màu sắc và ý nghĩa của Việt Nam
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                    <img
                      src="https://images2.thanhnien.vn/528068263637045248/2024/8/31/base64-17251183007861064965466.jpeg"
                      alt="Travel 2"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                        <h3 className="text-3xl lg:text-4xl font-bold mb-3">Thiên nhiên hùng vĩ</h3>
                        <p className="text-lg lg:text-xl opacity-90 leading-relaxed">
                          Khám phá vẻ đẹp hoang sơ và tráng lệ của đất nước
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                    <img
                      src="https://minhducpc.vn/uploads/images/hinh-nen-viet-nam-4k10.jpg"
                      alt="Travel 3"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                        <h3 className="text-3xl lg:text-4xl font-bold mb-3">Di sản văn hóa</h3>
                        <p className="text-lg lg:text-xl opacity-90 leading-relaxed">
                          Tìm hiểu lịch sử và văn hóa phong phú của Việt Nam
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-6 w-12 h-12 bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30" />
              <CarouselNext className="right-6 w-12 h-12 bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30" />
            </Carousel>
          </div>

          {/* Text & Buttons Section */}
          <div className="flex flex-col items-center text-center px-4">
            <div className="max-w-5xl space-y-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight leading-none">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Tour
                </span>
                <span className="text-gray-900">Mate</span>
              </h1>
              
              <p className="text-xl lg:text-2xl xl:text-3xl font-normal text-gray-600 leading-relaxed max-w-4xl mx-auto">
                Đến với chúng tôi, bạn sẽ được trải nghiệm những dịch vụ tốt nhất với mức giá hợp lý nhất. 
                Chúng tôi cam kết mang đến cho bạn những trải nghiệm tuyệt vời nhất trong chuyến đi của mình.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                <a
                  href="/contact"
                  className="group inline-flex justify-center items-center py-4 px-8 text-lg font-semibold text-white rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  Bắt đầu ngay
                  <svg
                    className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </a>
                
                <a
                  href="/contact"
                  className="group py-4 px-8 text-lg font-semibold text-gray-700 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Liên hệ với chúng tôi
                  </span>
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    500+
                  </div>
                  <div className="text-lg text-gray-600 font-medium">Hướng dẫn viên chuyên nghiệp</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
                    1000+
                  </div>
                  <div className="text-lg text-gray-600 font-medium">Chuyến đi thành công</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    50+
                  </div>
                  <div className="text-lg text-gray-600 font-medium">Điểm đến hấp dẫn</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
