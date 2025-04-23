"use client";

import Image from "next/image";
import Anh1 from "@/public/Anh1.jpg";
import Logo from "@/public/Logo.png";
import "@/styles/globals.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const AboutSunday = () => {
  useEffect(() => {
    AOS.init({
      offset: 0,
      delay: 200,
      duration: 1200,
      once: true,
    });
  }, []);

  return (
    <section className="w-full bg-white px-4 md:px-10 py-10 md:py-10">
      {/* Tiêu đề */}
      <div className="flex justify-center">
        <h2
          className="mb-10 text-3xl md:text-4xl inter text-center"
          data-aos="zoom-in"
          data-aos-delay="300"
        >
          Thông tin về chúng tôi
        </h2>
      </div>

      {/* Background + content */}
      <div
        className="relative w-full min-h-[600px]"
        data-aos="zoom-in"
        data-aos-delay="300"
      >
        {/* Background image */}
        <Image
          src={Anh1}
          alt="Thông tin về TourMate"
          fill
          className="object-cover object-center"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Grid nội dung */}
        <div className="relative z-10 max-w-screen-2xl mx-auto grid md:grid-cols-2 grid-cols-1 gap-10 items-center px-4 md:px-6 py-10">
          {/* Bên trái */}
          <div className="text-white space-y-6 md:space-y-8">
            <h2 className="text-2xl md:text-4xl charm-regular">
              Thông tin về TourMate
            </h2>
            <p className="text-sm md:text-base leading-relaxed">
              Ngày xưa, giữa những con phố đượm hương lịch sử và văn hóa, có
              những tâm hồn khao khát không chỉ được chiêm ngưỡng danh lam thắng
              cảnh mà còn được chạm vào linh hồn của mỗi nơi. Ban đầu, tour
              guide chỉ đơn giản là người dẫn đường, nhưng dần họ nhận ra mỗi
              chuyến đi là cơ hội mở ra tiềm năng và kết nối cả cộng đồng.
              <br />
              <br />
              Chính vì thế, một nhóm đam mê du lịch và công nghệ đã tạo ra một
              ứng dụng độc đáo, nơi du khách và tour guide giao lưu, chia sẻ và
              khám phá những trải nghiệm chân thực. Ứng dụng này không chỉ đặt
              lịch hẹn mà còn biến mỗi hành trình thành một câu chuyện sống
              động, truyền cảm hứng và mở ra những khả năng mới.
              <br />
              <br />
              Đó chính là “Hành Trình Khám Phá – Kết Nối Đam Mê”, nơi mỗi chuyến
              đi là bước khởi đầu cho những trải nghiệm tuyệt vời.
            </p>
            <a
              href="#"
              className="text-xs underline hover:text-gray-200 block"
            >
              XEM THÊM
            </a>
          </div>

          {/* Bên phải */}
          <div className="flex justify-center items-center w-full">
            <div className="relative bg-white/80 rounded-lg p-6 md:p-10 pt-16 backdrop-blur-md w-full max-w-md text-center">
              {/* Logo */}
              <div className="flex justify-center mb-4">
                <Image
                  src={Logo}
                  alt="Sunday team"
                  width={96}
                  height={96}
                  className="rounded-full border-4 border-white shadow-md bg-white"
                />
              </div>

              {/* Nội dung */}
              <h3 className="charm-bold text-xl md:text-2xl">
                “Hành Trình Khám Phá kết nối Đam Mê”
              </h3>
              <p className="text-sm md:text-base text-gray-700 mt-6 leading-relaxed">
                Chúng mình là nhóm Sunday, đến từ Trường Đại học FPT HCM. Với
                niềm đam mê mãnh liệt với mảng du lịch, đặc biệt là với mong
                muốn có thể mang tới những trải nghiệm thực tế với văn hóa địa
                phương, vì vậy chúng mình đã làm ra nền tảng để kết nối giữa
                khách du lịch và những người bạn TourGuide đồng hành,...
              </p>
              <a
                href="#"
                className="inline-block text-sm mt-6 underline text-gray-600 hover:text-gray-500"
              >
                THÔNG TIN THÊM VỀ SUNDAY
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSunday;
