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
      <FeedbackSection />
      <ContactPagination />
      <HomeNews />
      <Footer />
    </div>
  );
}
