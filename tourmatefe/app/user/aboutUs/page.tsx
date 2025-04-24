"use client";

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
    </main>
  );
}
