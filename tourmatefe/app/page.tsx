import 'flowbite';
import HeroSection from '@/components/HeroSection';
import AboutSunday from '@/components/AboutSunday';
import MegaMenu from '@/components/MegaMenu';

export default function Home() {
  return (
    <div>
      <MegaMenu />
      <HeroSection />
      <AboutSunday />
    </div>
  );
}
