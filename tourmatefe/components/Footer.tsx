"use client"

import Link from "next/link"
import Image from "next/image"
import Logo from "@/public/Logo.png"
import { FaFacebookF, FaInstagram, FaPhoneAlt, FaEnvelope } from "react-icons/fa"
import AOS from "aos"
import { useEffect } from "react"

export default function Footer() {
  useEffect(() => {
    AOS.init({
      offset: 0,
      delay: 200,
      duration: 1200,
      once: true,
    })
  }, [])

  return (
    <footer className="bg-white border-t border-gray-200" data-aos="fade-up">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-2" data-aos="fade-up" data-aos-delay="100">
            <Link href="/" className="flex items-center mb-6">
              <Image src={Logo || "/placeholder.svg"} alt="TourMate Logo" width={60} height={60} className="mr-3" />
              <span className="text-2xl font-bold text-gray-900">TourMate</span>
            </Link>
            <p className="text-gray-600 leading-relaxed mb-6 max-w-md">
              Kết nối du khách với hướng dẫn viên địa phương, mang đến những trải nghiệm du lịch chân thực và đáng nhớ.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=61576785473629"
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 group"
              >
                <FaFacebookF className="text-gray-600 group-hover:text-white" size={16} />
              </a>
              <a
                href="https://www.instagram.com/tourmate2025_"
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all duration-300 group"
              >
                <FaInstagram className="text-gray-600 group-hover:text-white" size={16} />
              </a>
            </div>
          </div>

          {/* Giới thiệu */}
          <div data-aos="fade-up" data-aos-delay="200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Giới thiệu</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/aboutUs" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Về Chúng Tôi
                </Link>
              </li>
              <li>
                <Link href="/services/active-area" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Địa điểm
                </Link>
              </li>
              <li>
                <Link href="/services/tour-guide" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Hướng Dẫn Viên
                </Link>
              </li>
              <li>
                <Link href="/tour-guide/bids" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Đấu giá Tour
                </Link>
              </li>
            </ul>
          </div>

          {/* Điều khoản */}
          <div data-aos="fade-up" data-aos-delay="300">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Hỗ trợ</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Điều Khoản Sử Dụng
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Chính Sách Bảo Mật
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Liên hệ hỗ trợ
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Tin tức
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div data-aos="fade-up" data-aos-delay="400">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Liên Hệ</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FaPhoneAlt className="text-gray-600" size={14} />
                </div>
                <span className="text-gray-600">0977-300-916</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FaEnvelope className="text-gray-600" size={14} />
                </div>
                <span className="text-gray-600">tourmate2025@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-12 pt-8" data-aos="fade-up" data-aos-delay="500">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500">
              © 2025 <span className="font-semibold text-gray-900">TourMate™</span>. All Rights Reserved.
            </div>
            <div className="flex gap-6">
              <Link href="#" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">
                Chính sách bảo mật
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
