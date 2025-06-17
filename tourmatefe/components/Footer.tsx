import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/Logo.png"; // đổi đúng đường dẫn logo

import { FaFacebookF, FaInstagram, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white shadow-md" data-aos="zoom-in-up">
      <hr className="border-gray-200 sm:mx-auto" />
      <div className="mx-auto max-w-screen-2xl px-4 py-10 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center md:col-span-1 mb-4 md:mb-0">
          <div className="flex flex-col items-start md:col-span-1">
            <Image src={Logo} alt="TourMate Logo" width={140} height={140} />
          </div>
        </Link>

        {/* Giới thiệu */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Giới thiệu</h3>
          <ul className="space-y-2 text-gray-600">
            <li><Link href="/aboutUs">Về Chúng Tôi</Link></li>
            <li><Link href="/services/active-area">Địa điểm</Link></li>
            <li><Link href="/services/tour-guide">Hướng Dẫn Viên</Link></li>
            <li><Link href="/tour-guide/bids">Đấu giá Tour</Link></li>
          </ul>
        </div>

        {/* Điều khoản */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Điều khoản sử dụng</h3>
          <ul className="space-y-2 text-gray-600">
            <li><Link href="#">Điều Khoản Sử Dụng</Link></li>
            <li><Link href="#">Chính Sách Bảo Mật Thông Tin</Link></li>
          </ul>
        </div>

        {/* Follow us */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4 text-gray-600">
            <a href="https://www.facebook.com/profile.php?id=61576785473629"><FaFacebookF size={20} /></a>
            <a href="https://www.instagram.com/tourmate2025_"><FaInstagram size={20} /></a>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Liên Hệ</h3>
          <div className="space-y-2 text-gray-600">
            <div className="flex items-center space-x-2">
              <FaPhoneAlt />
              <span>0977-300-916</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaEnvelope />
              <span>tourmate2025@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
      <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
      <span className="block text-sm text-gray-500 sm:text-center pb-8">© 2025 <a href="https://flowbite.com/" className="hover:underline">TourMate™</a>. All Rights Reserved.</span>
    </footer>
  );
}
