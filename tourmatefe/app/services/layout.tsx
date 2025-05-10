import Footer from '@/components/Footer';
import { ReactNode } from 'react';
import MegaMenu from '@/components/MegaMenu';

export default function ServiceLayout({ children }: { children: ReactNode }) {
  return (
      <div>
        <MegaMenu />
        <main>{children}</main>
        <Footer />
      </div>
  );
}
