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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@1,6..72,400;1,6..72,500;1,6..72,600&family=Space+Grotesk:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('ignite_theme');
                if (t === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased overflow-x-hidden bg-dark text-white" suppressHydrationWarning>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
