
import type { Metadata } from 'next';
import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

import RootLayoutClient from '@/components/layout/RootLayoutClient';

export const metadata: Metadata = {
  title: 'SpaceScope - Explore, Learn & Stay Connected with the Universe',
  description: 'Real-time space events, cosmic weather, missions, and Earth impact of satellite technology',
};





export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-background">
        <AuthProvider>
          {/* Client boundary for conditional nav/footer */}
          <RootLayoutClient>{children}</RootLayoutClient>
        </AuthProvider>
      </body>
    </html>
  );
}
