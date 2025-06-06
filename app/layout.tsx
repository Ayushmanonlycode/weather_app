import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} style={{
        backgroundImage: 'url("/back.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        backgroundColor: 'transparent',
      }}>
        <Providers>{children}</Providers>
        <script>
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js')
                  .then(registration => {
                    console.log('Service Worker registered with scope:', registration.scope);
                  })
                  .catch(err => {
                    console.error('Service Worker registration failed:', err);
                  });
              });
            }
          `}
        </script>
      </body>
    </html>
  );
}