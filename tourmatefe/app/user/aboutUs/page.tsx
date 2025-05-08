"use client";

import AboutUsHero from "./aboutHeroSection";
import AboutCarousel from "./about-carousel";
import OurSight from "./our-sight";
import CustomerTestimonials from "./testimonial-carousel";

export default function Page() {
  return (
    <main>
      <AboutUsHero
        badge="Thành lập 2025"
        title1="Hành trình của bạn"
        title2="Câu chuyện của chúng tôi"
        description="Tại Tourmate, chúng tôi tạo ra những trải nghiệm du lịch không thể quên thông qua các hành trình được chọn lọc kỹ càng, những hướng dẫn viên địa phương chuyên nghiệp và niềm đam mê sâu sắc với việc khám phá thực sự."
/>
      <AboutCarousel />
      <OurSight />
      <CustomerTestimonials />
    </main>
  );
}
