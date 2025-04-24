"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import 'aos/dist/aos.css';
import AOS from 'aos';


interface Testimonial {
  id: number;
  name: string;
  quote: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Minh Phương",
    quote:
      "TourMate giúp tôi tìm được một hướng dẫn viên địa phương tuyệt vời tại Đà Lạt. Chuyến đi trở nên thú vị hơn rất nhiều nhờ những câu chuyện và góc nhìn mà tôi chưa từng biết! Nhất định trong chuyến đi tiếp theo tôi sẽ tiếp tục đồng hành của TourMate.",
    image: "/woman.jpeg",
  },
  {
    id: 2,
    name: "Thanh Hà",
    quote:
      "Chuyến du lịch Hội An của tôi trở nên đặc biệt nhờ hướng dẫn viên từ TourMate. Tôi được khám phá những con hẻm nhỏ, quán ăn địa phương mà không có trong sách hướng dẫn du lịch nào.",
    image: "/woman2.jpeg",
  },
  {
    id: 3,
    name: "Quang Minh",
    quote:
      "Đây là lần đầu tiên tôi sử dụng dịch vụ hướng dẫn viên địa phương và TourMate không làm tôi thất vọng. Chuyến đi Sapa của tôi trở nên đáng nhớ với những trải nghiệm văn hóa độc đáo.",
    image: "/man.jpg",
  },
  {
    id: 4,
    name: "Thu Trang",
    quote:
      "TourMate giúp tôi kết nối với một hướng dẫn viên địa phương tại Phú Quốc. Chúng tôi đã khám phá những bãi biển hoang sơ và thưởng thức hải sản tươi ngon tại những nơi chỉ người địa phương mới biết.",
    image: "/woman3.jpeg",
  },
];

export default function CustomerTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
        AOS.init({
          offset: 0,
          delay: 200,
          duration: 1200,
          once: true,
        });
      }, []);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 8000);

    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="py-20 bg-gray-100 relative overflow-hidden" data-aos="fade-in">
      {/* Decorative Elements */}
       <div className="absolute top-[-40] left-10 w-55 opacity-60 hidden md:block transform rotate-12 drop-shadow-lg">
    <Image
      src="/shell.png?height=200&width=200"
      alt="Seashell decoration"
      width={300}
      height={300}
    />
  </div>

      <div className="absolute top-10 right-10 hidden md:block">
        <div className="relative w-40 h-48">
          <div className="absolute top-0 right-0 w-40 h-45 bg-white p-2 shadow-md rotate-6 z-10">
            <div className="relative w-full h-full bg-gray-200">
              <Image
                src="/travel.jpg" // Đường dẫn đến ảnh của bạn
                alt="Travel memory 1"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="absolute top-4 right-8 w-40 h-45 bg-white p-2 shadow-md -rotate-3">
            <div className="relative w-full h-full bg-gray-200">
              <Image
                src="/travel2.jpg" // Đường dẫn đến ảnh của bạn
                alt="Travel memory 1"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-10 hidden md:block">
        <div className="relative w-60 h-55">
          <Image
            src="/travel-items.png" // Đường dẫn đến ảnh của bạn
            alt="Travel memory 1"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
            Đánh Giá Của Khách Hàng
          </h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-24 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg mb-8">
                  <Image
                    src={testimonials[currentIndex].image || "/travel.jpg"}
                    alt={testimonials[currentIndex].name}
                    width={500}
                    height={500}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="text-center mb-6">
                  <Quote className="h-10 w-10 text-blue-200 mx-auto mb-4" />
                  <p className="text-gray-700 text-lg md:text-xl italic leading-relaxed mb-6">
                    &ldquo;{testimonials[currentIndex].quote}&rdquo;
                  </p>
                  <h3 className="text-xl font-bold text-blue-600">
                    {testimonials[currentIndex].name}
                  </h3>
                </div>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-gray-600 hover:bg-gray-700 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-20"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-gray-600 hover:bg-gray-700 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-20"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
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
                    ? "bg-blue-500 w-6"
                    : "bg-gray-300 hover:bg-gray-400"
                )}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
