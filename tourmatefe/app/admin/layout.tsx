// layouts/AdminLayout.js
import Header from '@/components/MegaMenu';
import Footer from '@/components/Footer';

import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-layout">
      <Header />
      <div className="admin-content">
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
}
