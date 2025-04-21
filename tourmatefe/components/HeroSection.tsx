"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import Anh7 from "../public/Anh7.jpg";
import Anh5 from "@/public/Anh5.jpg";
import Anh3 from "@/public/Anh3.jpg";
import "@/styles/globals.css";
import AOS from "aos";


const HeroSection = () => {
  
    useEffect(() => {
      AOS.init({
        offset: 0,
        delay: 200,
        duration: 1200,
        once: true,
      });
    }, []);

  return (
    <section className="w-full bg-white">
  <div className="grid md:grid-cols-2 grid-cols-1">
    {/* Khám phá */}
    <div className="relative h-[600px] w-full"         data-aos='fade'
              data-aos-delay='400'>
      <Image
        src={Anh7}
        alt="Khám phá"
        fill
        className="object-cover"

      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute bottom-6 left-6 text-white space-y-2 z-10">
        <h2 className="text-4xl mb-105 charm-regular">Khám phá</h2>
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
    <div className="flex flex-col"         data-aos='fade'
              data-aos-delay='400'>
      {/* Phong cách sống */}
      <div className="relative h-[300px] w-full">
        <Image
          src={Anh5}
          alt="Phong cách sống"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-6 left-6 text-white space-y-2 z-10">
          <h2 className="text-3xl mb-35 charm-regular">Phong cách sống</h2>
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
          <h2 className="text-3xl mb-35 charm-regular">Tâm hồn</h2>
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
