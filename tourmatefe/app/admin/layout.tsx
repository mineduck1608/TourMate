'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/components/authProvider';
import AdminContent from '@/components/admin-content';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="admin-layout">
        <main>
          <AdminContent>{children}</AdminContent>
        </main>
      </div>
    </AuthProvider>
  );
}
