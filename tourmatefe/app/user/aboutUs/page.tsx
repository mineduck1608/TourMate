"use client";

// tourmatefe/app/about/page.tsx
import Banner from "@/components/Banner";

import AboutUsHero from "./aboutHeroSection";
import AboutCarousel from "./about-carousel";
import OurSight from "./our-sight";
import CustomerTestimonials from "./testimonial-carousel";

export default function Page() {
  return (
    <main>
      <AboutUsHero
        badge="Established 2025"
        title1="Our Journey"
        title2="Explore With Us"
        description="At Tourmate, we craft unforgettable travel experiences through carefully curated journeys, expert local guides, and a deep passion for authentic discovery."
      />
      <AboutCarousel />
      <OurSight />
      <CustomerTestimonials />
      <div>
        <Banner
          imageUrl="https://img.freepik.com/free-photo/city-water_1417-1902.jpg?t=st=1745300345~exp=1745303945~hmac=da67d1a3c246aae8db124eb79afe486b89b0e304343c87834e85fceec37a7ab7&w=996"
          title="Khám Phá Ẩm Thực Địa Phương Tại Hà Nội"
        />
      </div>
    </main>
  );
}
