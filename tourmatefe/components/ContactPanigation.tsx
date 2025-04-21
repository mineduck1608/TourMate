'use client';

import Link from 'next/link';
import { MailIcon } from 'lucide-react';

export default function ContactPagination() {
  return (
    <section className="bg-white" data-aos="fade-up"
    data-aos-anchor-placement="top-bottom">
      <div className="py-12 px-4 mx-auto max-w-screen-xl text-center lg:py-20">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-tight text-gray-900 md:text-5xl lg:text-6xl">
          Kết nối với hướng dẫn viên địa phương dễ dàng hơn bao giờ hết
        </h1>
        <p className="mb-8 text-lg font-normal text-gray-600 lg:text-xl sm:px-16 lg:px-48">
          Bạn đang lên kế hoạch khám phá một điểm đến mới? Hãy để chúng tôi kết nối bạn với những hướng dẫn viên địa phương am hiểu văn hóa, ngôn ngữ và các điểm đến độc đáo – mang lại trải nghiệm du lịch chân thực và đáng nhớ nhất.
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg transition duration-300"
          >
            <MailIcon className="w-5 h-5" />
            <span>Liên hệ ngay</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
