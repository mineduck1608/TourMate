import Footer from '@/components/footer';
import { ReactNode } from 'react';
import MegaMenu from '@/components/mega-menu';

export default function ServiceLayout({ children }: { children: ReactNode }) {
  return (
      <div>
        <MegaMenu />
        <main>{children}</main>
        <Footer />
      </div>
  );
}
