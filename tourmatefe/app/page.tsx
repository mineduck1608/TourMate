import 'flowbite';
import HeroSection from '@/components/HeroSection';
import AboutSunday from '@/components/AboutSunday';
import HomeNews from '@/components/HomeNews';
import FeedbackSection from '@/components/FeedbackSection';
import TourGuideCard from '@/components/TourGuideCard';
import ContactPagination from '@/components/ContactPanigation';


export default function Home() {

  return (
    <div>
      <HeroSection />
      <TourGuideCard />
      <AboutSunday />
      <HomeNews />
      <FeedbackSection />
      <ContactPagination />
    </div>
  );
}
