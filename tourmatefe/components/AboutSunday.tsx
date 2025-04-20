"use client";

import Image from "next/image";
import Anh1 from "@/public/Anh1.jpg";


const AboutSunday = () => {
  return (
    <section className="w-full bg-white p-10">
      <div className="relative w-full h-[600px]">
        {/* Background image */}
        <Image
          src={Anh1}
          alt="Thông tin về TourMate"
          fill
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 " />

        {/* Nội dung chính */}
        <div className="relative z-10 max-w-screen mx-auto h-full grid md:grid-cols-2 grid-cols-1 gap-30 items-center px-6">
          {/* Bên trái */}
          <div className="text-white space-y-25 pr-4">
            <h2 className="text-3xl italic font-semibold">Thông tin về TourMate</h2>
            <p className="text-m leading-relaxed">
              Ngày xưa, giữa những con phố đượm hương lịch sử và văn hóa, có những tâm hồn
              khao khát không chỉ được chiêm ngưỡng danh lam thắng cảnh mà còn được chạm vào
              linh hồn của mỗi nơi. Ban đầu, tour guide chỉ đơn giản là người dẫn đường, nhưng
              dần họ nhận ra mỗi chuyến đi là cơ hội mở ra tiềm năng và kết nối cả cộng đồng.
              <br />
              <br />
              Chính vì thế, một nhóm đam mê du lịch và công nghệ đã tạo ra một ứng dụng độc đáo,
              nơi du khách và tour guide giao lưu, chia sẻ và khám phá những trải nghiệm chân thực.
              Ứng dụng này không chỉ đặt lịch hẹn mà còn biến mỗi hành trình thành một câu chuyện
              sống động, truyền cảm hứng và mở ra những khả năng mới.
              <br />
              <br />
              Đó chính là “Hành Trình Khám Phá – Kết Nối Đam Mê”, nơi mỗi chuyến đi là bước khởi
              đầu cho những trải nghiệm tuyệt vời.
            </p>
            <a
              href="#"
              className="text-xs underline hover:text-gray-200 block"
            >
              XEM THÊM
            </a>
          </div>

          {/* Bên phải */}
          <div className="bg-white/80 rounded-lg p-20 relative backdrop-blur-md mt-10 md:mt-0 mr-15">
            {/* Avatar tròn */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
              <Image
                src={Anh1}
                alt="Sunday team"
                width={96}
                height={96}
                className="rounded-full border-4 border-white shadow-md"
              />
            </div>

            {/* Nội dung */}
            <div className="mt-10 text-center space-y-4">
              <h3 className="italic font-semibold text-lg">
                “Hành Trình Khám Phá kết nối Đam Mê”
              </h3>
              <p className="text-m text-gray-700">
                Chúng mình là nhóm Sunday, đến từ Trường Đại học FPT HCM. Với niềm đam mê mãnh
                liệt với mảng du lịch, đặc biệt là với mong muốn có thể mang tới những trải nghiệm
                thực tế với văn hóa địa phương, vì vậy chúng mình đã làm ra nền tảng để kết nối giữa
                khách du lịch và những người bạn TourGuide đồng hành,...
              </p>
              <a
                href="#"
                className="inline-block text-sm mt-10 underline text-gray-600 hover:text-gray-400 "
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
