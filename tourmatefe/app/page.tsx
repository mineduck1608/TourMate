import 'flowbite';
import HeroSection from '@/components/HeroSection';
import AboutSunday from '@/components/AboutSunday';
import MegaMenu from '@/components/MegaMenu';
import HomeNews from '@/components/HomeNews';
import FeedbackSection from '@/components/FeedbackSection';
import TourGuideCard from '@/components/TourGuideCard';
import ContactPagination from '@/components/ContactPanigation';
import Footer from '@/components/Footer';


export default function Home() {
  return (
    <div>
      <MegaMenu />
      <HeroSection />
      <TourGuideCard />
      <AboutSunday />
      <HomeNews />
      <FeedbackSection />
      <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700 mr-5 ml-5" data-aos="fade-in"></hr>
      <ContactPagination />
      <Footer />
    </div>
  );
}
