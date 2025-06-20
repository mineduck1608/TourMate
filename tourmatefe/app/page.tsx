"use client"
import 'flowbite';
import HeroSection from '@/components/hero-section';
import AboutSunday from '@/components/about-sunday';
import MegaMenu from '@/components/mega-menu';
import HomeNews from '@/components/home-news';
import FeedbackSection from '@/components/feedback-section';
import ContactPagination from '@/components/contact-panigation';
import Footer from '@/components/Footer';
import ContactText from './contact/contactText';
import RotatingTourGuideHomePage from '@/components/rotating-tour-guide-home-page';
// import TourGuideCard from '@/components/tour-guide-card';


export default function Home() {

  return (
    <div>
      <MegaMenu />
      <HeroSection />
      <AboutSunday />
      <ContactText />
      {/* <TourGuideCard /> */}
      <RotatingTourGuideHomePage />
      <FeedbackSection />
      <ContactPagination />
      <HomeNews />
      <Footer />
    </div>
  );
}
