"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarouselItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

const carouselItems: CarouselItem[] = [
  {
    id: 1,
    title: "TẦM NHÌN",
    description:
      "Trở thành nền tảng kết nối du lịch hàng đầu, mang đến trải nghiệm cá nhân hóa và chân thực.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-I9plF7ngUFGqGri5wVDZxblmqFa4La.png",
  },
  {
    id: 2,
    title: "SỨ MỆNH",
    description:
      "Kết nối du khách với hướng dẫn viên địa phương chất lượng. Thúc đẩy du lịch bền vững và hỗ trợ cộng đồng hướng dẫn viên.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-I9plF7ngUFGqGri5wVDZxblmqFa4La.png",
  },
  {
    id: 3,
    title: "GIÁ TRỊ CỐT LÕI",
    description:
      "Cá nhân hóa – Tạo hành trình phù hợp với từng du khách. Chân thực – Mang đến trải nghiệm địa phương sâu sắc.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-I9plF7ngUFGqGri5wVDZxblmqFa4La.png",
  },
];

export default function SimpleCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            About Us
          </h2>
          <div className="w-20 h-1 bg-teal-500 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Learn more about our company's vision, mission, and core values that
            drive everything we do
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {carouselItems.map((item) => (
                <div key={item.id} className="w-full flex-shrink-0 px-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((index) => {
                      const itemIndex =
                        (item.id - 1 + index - 1) % carouselItems.length;
                      return (
                        <div key={index} className="flex flex-col items-center">
                          <div className="relative w-full h-64 mb-6 overflow-hidden rounded-lg">
                            <Image
                              src={
                                index === 1
                                  ? "/placeholder.svg?height=600&width=800"
                                  : index === 2
                                  ? "/placeholder.svg?height=600&width=800"
                                  : "/placeholder.svg?height=600&width=800"
                              }
                              alt={carouselItems[itemIndex].title}
                              fill
                              className="object-cover transition-transform duration-500 hover:scale-110"
                            />
                          </div>
                          <h3 className="text-xl font-bold text-teal-600 mb-3">
                            {index === 1
                              ? "TẦM NHÌN"
                              : index === 2
                              ? "SỨ MỆNH"
                              : "GIÁ TRỊ CỐT LÕI"}
                          </h3>
                          <p className="text-gray-600 text-center">
                            {index === 1
                              ? "Trở thành nền tảng kết nối du lịch hàng đầu, mang đến trải nghiệm cá nhân hóa và chân thực."
                              : index === 2
                              ? "Kết nối du khách với hướng dẫn viên địa phương chất lượng. Thúc đẩy du lịch bền vững và hỗ trợ cộng đồng hướng dẫn viên."
                              : "Cá nhân hóa – Tạo hành trình phù hợp với từng du khách. Chân thực – Mang đến trải nghiệm địa phương sâu sắc."}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-0 md:-left-12 top-1/2 -translate-y-1/2 bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-full z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 md:-right-12 top-1/2 -translate-y-1/2 bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-full z-10"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (isAnimating) return;
                setIsAnimating(true);
                setCurrentIndex(index);
                setTimeout(() => setIsAnimating(false), 500);
              }}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                currentIndex === index
                  ? "bg-teal-500 w-6"
                  : "bg-gray-300 hover:bg-gray-400"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
