import React from 'react';
import type { Metadata, Viewport } from 'next';
import AppShell from '@/components/AppShell';
import '@/index.css';

export const metadata: Metadata = {
  title: 'IGNITE - Technical Innovation Club',
  description: 'Official website of IGNITE - The Technical Innovation Club. Empowering students through technology, innovation, and collaboration.',
  metadataBase: new URL('https://ignite-technical-innovation-club.vercel.app'),
  icons: {
    icon: '/image.png',
  },
  openGraph: {
    type: 'website',
    url: 'https://ignite-technical-innovation-club.vercel.app/',
    title: 'IGNITE - Technical Innovation Club',
    description: 'Empowering students through technology, innovation, and collaboration.',
    images: ['/igu.jpeg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IGNITE - Technical Innovation Club',
    description: 'Empowering students through technology, innovation, and collaboration.',
    images: ['/igu.jpeg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#0b0f14',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased overflow-x-hidden">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
