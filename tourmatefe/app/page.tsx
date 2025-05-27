"use client"
import 'flowbite';
import HeroSection from '@/components/hero-section';
import AboutSunday from '@/components/about-sunday';
import MegaMenu from '@/components/mega-menu';
import HomeNews from '@/components/home-news';
import FeedbackSection from '@/components/feedback-section';
import TourGuideCard from '@/components/tour-guide-card';
import ContactPagination from '@/components/contact-panigation';
import Footer from '@/components/footer';
import ContactText from './contact/contactText';


export default function Home() {

  return (
    <div>
      <MegaMenu />
      <HeroSection />
      <AboutSunday />
      <ContactText />
      <TourGuideCard />
      <FeedbackSection />
      <ContactPagination />
      <HomeNews />
      <Footer />
    </div>
  );
}
