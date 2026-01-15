"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Hide Navbar/Footer for any /explore route (including subroutes)
  const hideNavFooter = pathname.startsWith('/explore');
  return (
    <>
      {!hideNavFooter && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!hideNavFooter && <Footer />}
    </>
  );
}
