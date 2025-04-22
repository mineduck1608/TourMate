// layouts/UserLayout.js
import Header from '@/components/MegaMenu';
import Footer from '@/components/Footer';

import { ReactNode } from 'react';

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
