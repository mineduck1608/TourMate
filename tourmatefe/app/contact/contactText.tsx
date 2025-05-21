// components/ContactText.tsx
import React, { useEffect } from "react";

import AOS from "aos";
import 'aos/dist/aos.css';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

export function Example() {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
    >
      // ...
    </Carousel>
  )
}



export default function ContactText() {

  useEffect(() => {
    AOS.init({
      offset: 0,
      delay: 200,
      duration: 1200,
      once: true,
    });
  }, []);

  return (
    <section
      className="bg-white dark:bg-gray-900"
      data-aos="fade-in"
      data-aos-delay="400"
    >
      <div className="max-w-6xl mx-auto py-10 px-8 mt-10"> {/* max-w tăng lên, padding cũng tăng */}
        <div className="flex flex-col space-y-16"> {/* khoảng cách lớn hơn */}

          {/* Carousel */}
          <div>
            <Carousel
              plugins={[
                Autoplay({
                  delay: 2000,
                }),
              ]}
            >
              <CarouselContent>
                <CarouselItem>
                  <img
                    src="https://media.vietnamplus.vn/images/7255a701687d11cb8c6bbc58a6c807853659c4f5e6c18951e9d585356e8f856798b4b711ae88fece3a45233417a3d845a74f6b1bfe70b3203772c7979020cefa/99Thuyen_hoa.jpg"
                    alt="Travel 1"
                    className="rounded-lg object-cover w-full h-96 sm:h-[400px]"  // chiều cao lớn hơn
                  />
                </CarouselItem>
                <CarouselItem>
                  <img
                    src="https://travelguide.org.vn/img/images/6-1568600280322.jpg"
                    alt="Travel 2"
                    className="rounded-lg object-cover w-full h-96 sm:h-[400px]"
                  />
                </CarouselItem>
                <CarouselItem>
                  <img
                    src="https://minhducpc.vn/uploads/images/hinh-nen-viet-nam-4k10.jpg"
                    alt="Travel 3"
                    className="rounded-lg object-cover w-full h-96 sm:h-[400px]"
                  />
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Text & Buttons */}
          <div className="flex flex-col items-center text-center px-4">
            <h1 className="mb-8 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-gray-900 dark:text-white">
              TourMate
            </h1>
            <p className="mb-12 max-w-4xl text-xl lg:text-2xl font-normal text-gray-500 dark:text-gray-400">
              Đến với chúng tôi, bạn sẽ được trải nghiệm những dịch vụ tốt nhất với mức giá hợp lý nhất. Chúng tôi cam kết mang đến cho bạn những trải nghiệm tuyệt vời nhất trong chuyến đi của mình.
            </p>
            <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-6 sm:space-y-0 justify-center">
              <a
                href="#"
                className="inline-flex justify-center items-center py-4 px-7 text-lg font-semibold text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
              >
                Bắt đầu ngay
                <svg
                  className="w-4 h-4 ms-3 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="py-4 px-7 text-base font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Liên hệ với chúng tôi
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

  );
}
