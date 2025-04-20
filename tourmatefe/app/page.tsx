import 'flowbite';
import HeroSection from '@/components/HeroSection';
import AboutSunday from '@/components/AboutSunday';
import Header from '../components/Header';

export default function Home() {
  return (
    <div>
      <Header />
      <HeroSection />
      <AboutSunday />
    </div>
  );
}
