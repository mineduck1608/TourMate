"use client";

import Image from "next/image";
import { Users } from "lucide-react";
import { motion } from "framer-motion";

export default function OurSight() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
          {/* Left side - Image */}
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative h-[400px] md:h-[500px] rounded-[40px] overflow-hidden shadow-2xl">
              <Image
                src="/hiking.jpg?height=800&width=800"
                alt="Hikers on a mountain trail"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-8 w-8 text-teal-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-teal-500">
                Chúng tôi làm gì?
              </h2>
            </div>

            <div className="space-y-6 text-gray-700">
              <p className="leading-relaxed">
                TourMate là nền tảng kết nối du khách với hướng dẫn viên địa
                phương, mang đến trải nghiệm du lịch độc lập theo phong cách
                khám phá. Chúng tôi cung cấp các hướng dẫn viên uy tín, chất
                lượng, giúp du khách dễ dàng tìm được người đồng hành am hiểu
                địa phương, đáp ứng nhu cầu cá nhân và tạo nên những hành trình
                đáng nhớ.
              </p>

              <p className="leading-relaxed">
                Chúng tôi cam kết mang đến một nền tảng an toàn, minh bạch và
                tiện lợi, giúp du khách kết nối nhanh chóng với những hướng dẫn
                viên chuyên nghiệp, tận tâm. Hãy để TourMate đồng hành cùng bạn
                trên mỗi chuyến đi, biến mọi hành trình trở nên thú vị, ý nghĩa
                và đong đầy kỷ niệm khó quên.
              </p>

              <div className="pt-4">
                <button className="px-8 py-3 bg-gradient-to-r from-teal-300 to-blue-600 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
                  Tìm hiểu thêm
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
