import Image from "next/image";
import React from "react";
import Anh1 from "@/public/Anh1.jpg";
import Anh2 from "@/public/Anh2.jpg";
import Anh3 from "@/public/Anh3.jpg";


const HeroSection = () => {
  return (
    <section className="w-full bg-white">
  <div className="grid md:grid-cols-2 grid-cols-1">
    {/* Khám phá */}
    <div className="relative h-[600px] w-full">
      <Image
        src={Anh1}
        alt="Khám phá"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute bottom-6 left-6 text-white space-y-2 z-10">
        <h2 className="text-2xl italic font-semibold mb-105">Khám phá</h2>
        <p className="text-sm max-w-md">
          Bạn muốn trải nghiệm du lịch theo cách chân thực và độc đáo nhất?
          Hãy kết nối ngay với các hướng dẫn viên địa phương để có hành
          trình đáng nhớ!
        </p>
        <a href="#" className="text-xs underline hover:text-gray-200">
          XEM THÊM
        </a>
      </div>
    </div>

    {/* Phong cách sống + Tâm hồn */}
    <div className="flex flex-col">
      {/* Phong cách sống */}
      <div className="relative h-[300px] w-full">
        <Image
          src={Anh2}
          alt="Phong cách sống"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-6 left-6 text-white space-y-2 z-10">
          <h2 className="text-xl italic font-semibold mb-35">Phong cách sống</h2>
          <p className="text-sm max-w-sm">
            Trải nghiệm du lịch theo cách chân thực bằng cách kết nối với
            hướng dẫn viên địa phương am hiểu văn hóa.
          </p>
          <a href="#" className="text-xs underline hover:text-gray-200">
            XEM THÊM
          </a>
        </div>
      </div>

      {/* Tâm hồn */}
      <div className="relative h-[300px] w-full">
        <Image
          src={Anh3}
          alt="Tâm hồn"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-6 left-6 text-white space-y-2 z-10">
          <h2 className="text-xl italic font-semibold mb-35">Tâm hồn</h2>
          <p className="text-sm max-w-sm">
            Du lịch không chỉ là khám phá mà còn là cách để tìm lại sự cân
            bằng trong tâm hồn.
          </p>
          <a href="#" className="text-xs underline hover:text-gray-200">
            XEM THÊM
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

  );
};

export default HeroSection;
