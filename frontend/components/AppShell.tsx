'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import Cursor from './Cursor';
import AnimatedBackground from './AnimatedBackground';
import { Analytics } from '@vercel/analytics/react';

// Scroll to top on route change
const ScrollToTop = () => {
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNav = pathname === '/exam';

  return (
    <div className="bg-dark text-white min-h-screen selection:bg-primary selection:text-white relative">
      <Cursor />
      <AnimatedBackground />
      <ScrollToTop />
      {!hideNav && <Navbar />}
      <main className="relative z-10">{children}</main>
      {!hideNav && <Footer />}
      <Analytics />
    </div>
  );
}
