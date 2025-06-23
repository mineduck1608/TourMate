"use client"

import Image from "next/image"
import { useEffect } from "react"
import Anh7 from "../public/Anh7.jpg"
import Anh3 from "@/public/Anh3.jpg"
import "@/styles/globals.css"
import AOS from "aos"
import "aos/dist/aos.css"

const HeroSection = () => {
  useEffect(() => {
    AOS.init({
      offset: 0,
      delay: 200,
      duration: 1200,
      once: true,
    })
  }, [])

  return (
    <section className="w-full bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>

      <div className="relative grid lg:grid-cols-2 grid-cols-1 min-h-screen">
        {/* Left Side - Khám phá */}
        <div
          className="relative h-[600px] lg:h-screen w-full group overflow-hidden"
          data-aos="fade-right"
          data-aos-delay="400"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-10"></div>
          <Image
            src={Anh7 || "/placeholder.svg"}
            alt="Khám phá"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-20" />

          {/* Content overlay */}
          <div className="absolute inset-0 z-30 flex flex-col justify-end p-8 lg:p-12">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-white/20 shadow-2xl">
              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 charm-regular">Khám phá</h2>
              <p className="text-lg lg:text-xl text-white/90 mb-6 leading-relaxed max-w-md">
                Bạn muốn trải nghiệm du lịch theo cách chân thực và độc đáo nhất? Hãy kết nối ngay với các hướng dẫn
                viên địa phương để có hành trình đáng nhớ!
              </p>
              <a
                href="/aboutUs"
                className="inline-flex items-center text-white hover:text-blue-200 transition-colors group/link"
              >
                <span className="text-sm font-semibold tracking-wide">XEM THÊM</span>
                <svg
                  className="w-4 h-4 ml-2 transition-transform group-hover/link:translate-x-1"
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

        {/* Right Side - Split into two sections */}
        <div className="flex flex-col" data-aos="fade-left" data-aos-delay="600">
          {/* Top - Phong cách sống */}
          <div className="relative h-[300px] lg:h-1/2 w-full group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-teal-600/20 z-10"></div>
            <Image
              src="https://img.freepik.com/free-photo/tourists-take-boat-ban-rak-thai-village-mae-hong-son-province-thailand_335224-1302.jpg?t=st=1745242612~exp=1745246212~hmac=cddcf4dbbc5a34989655479be3006c5170ee554e310f01f3928e617de9dac786&w=996"
              alt="Phong cách sống"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-20" />

            <div className="absolute inset-0 z-30 flex flex-col justify-end p-6 lg:p-8">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 lg:p-6 border border-white/20">
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 charm-regular">Phong cách sống</h2>
                <p className="text-sm lg:text-base text-white/90 mb-4 leading-relaxed">
                  Trải nghiệm du lịch theo cách chân thực bằng cách kết nối với hướng dẫn viên địa phương am hiểu văn
                  hóa.
                </p>
                <a
                  href="/aboutUs"
                  className="inline-flex items-center text-white hover:text-green-200 transition-colors group/link"
                >
                  <span className="text-xs font-semibold tracking-wide">XEM THÊM</span>
                  <svg
                    className="w-3 h-3 ml-2 transition-transform group-hover/link:translate-x-1"
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

          {/* Bottom - Tâm hồn */}
          <div className="relative h-[300px] lg:h-1/2 w-full group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 z-10"></div>
            <Image
              src={Anh3 || "/placeholder.svg"}
              alt="Tâm hồn"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-20" />

            <div className="absolute inset-0 z-30 flex flex-col justify-end p-6 lg:p-8">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 lg:p-6 border border-white/20">
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 charm-regular">Tâm hồn</h2>
                <p className="text-sm lg:text-base text-white/90 mb-4 leading-relaxed">
                  Du lịch không chỉ là khám phá mà còn là cách để tìm lại sự cân bằng trong tâm hồn.
                </p>
                <a
                  href="/aboutUs"
                  className="inline-flex items-center text-white hover:text-purple-200 transition-colors group/link"
                >
                  <span className="text-xs font-semibold tracking-wide">XEM THÊM</span>
                  <svg
                    className="w-3 h-3 ml-2 transition-transform group-hover/link:translate-x-1"
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
    </section>
  )
}

export default HeroSection
