'use client'
import Footer from '@/components/Footer';
import MegaMenu from '@/components/mega-menu';
import { ReactNode } from 'react';

export default function ServiceLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <MegaMenu />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
