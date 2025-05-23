"use client";

import Image from "next/image";
import "aos/dist/aos.css";
import AOS from "aos";
import { useEffect } from "react";

interface AboutItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

const aboutItems: AboutItem[] = [
  {
    id: 1,
    title: "TẦM NHÌN",
    description:
      "Trở thành nền tảng kết nối du lịch hàng đầu, mang đến trải nghiệm cá nhân hóa và chân thực.",
    image: "/passport.jpg",
  },
  {
    id: 2,
    title: "SỨ MỆNH",
    description:
      "Kết nối du khách với hướng dẫn viên địa phương chất lượng. Thúc đẩy du lịch bền vững và hỗ trợ cộng đồng hướng dẫn viên.",
    image: "/tourguide.jpg",
  },
  {
    id: 3,
    title: "GIÁ TRỊ CỐT LÕI",
    description:
      "Cá nhân hóa - Tạo hành trình phù hợp với từng du khách. Chân thực - Mang đến trải nghiệm địa phương sâu sắc.",
    image: "/personalization.jpg",
  },
];

export default function AboutCarousel() {
  useEffect(() => {
    AOS.init({
      offset: 0,
      delay: 200,
      duration: 1200,
      once: true,
    });
  }, []);

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Về chúng tôi
          </h2>
          <div className="w-20 h-1 bg-teal-500 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tìm hiểu thêm về tầm nhìn, sứ mệnh và các giá trị cốt lõi của công
            ty chúng tôi, những yếu tố thúc đẩy mọi hoạt động mà chúng tôi thực
            hiện
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          data-aos="flip-up"
        >
          {aboutItems.map((item) => (
            <div key={item.id} className="flex flex-col items-center">
              <div className="relative w-full h-64 mb-6 overflow-hidden rounded-lg">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <h3 className="text-xl font-bold text-teal-600 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 text-center">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
