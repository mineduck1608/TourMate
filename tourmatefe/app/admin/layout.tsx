// layouts/AdminLayout.js
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-layout">
      <div className="admin-content">
        <main>{children}</main>
      </div>
    </div>
  );
}
