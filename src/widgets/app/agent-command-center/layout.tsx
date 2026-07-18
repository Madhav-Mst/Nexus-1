'use client';

import { WidgetLayout } from '@nitrostack/widgets';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'Inter, system-ui, sans-serif', background: '#020617' }}>
        <WidgetLayout>{children}</WidgetLayout>
      </body>
    </html>
  );
}
