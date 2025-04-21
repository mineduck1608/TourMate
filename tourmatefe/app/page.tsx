import 'flowbite';
import HeroSection from '@/components/HeroSection';
import AboutSunday from '@/components/AboutSunday';
import MegaMenu from '@/components/MegaMenu';
import HomeNews from '@/components/HomeNews';
import FeedbackSection from '@/components/FeedbackSection';


export default function Home() {
  return (
    <div>
      <MegaMenu />
      <HeroSection />
      <AboutSunday />
      <HomeNews />
      <FeedbackSection />
    </div>
  );
}
