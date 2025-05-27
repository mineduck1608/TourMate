import Footer from '@/components/Footer';
import { ReactNode } from 'react';
import MegaMenu from '@/components/mega-menu';

export default function TourGuideLayout({ children }: { children: ReactNode }) {
  return (
      <div>
        <MegaMenu />
        <main>{children}</main>
        <Footer />
      </div>
  );
}
