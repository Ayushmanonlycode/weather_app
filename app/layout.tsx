import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { registerServiceWorker } from '@/lib/service-worker';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Weather Forecast App',
  description: 'Check weather conditions and forecasts for locations worldwide',
  manifest: '/manifest.json',
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Weather App',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
    shortcut: '/icons/icon-192x192.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (typeof window !== 'undefined') {
    registerServiceWorker();
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} weather-app-background`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}