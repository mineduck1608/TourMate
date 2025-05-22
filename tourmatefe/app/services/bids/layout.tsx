import { ReactNode } from 'react';

export default function ServiceLayout({ children }: { children: ReactNode }) {
  return (
      <div>
        <main>{children}</main>
      </div>
  );
}
