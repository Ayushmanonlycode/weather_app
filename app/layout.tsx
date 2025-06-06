import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { registerServiceWorker } from '@/lib/service-worker';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Weather Forecast App',
  description: 'Check weather conditions and forecasts for locations worldwide',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
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