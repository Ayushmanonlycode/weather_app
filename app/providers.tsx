'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { UserPreferencesProvider } from '@/hooks/useUserPreferences';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <UserPreferencesProvider>
        {children}
        <Toaster />
      </UserPreferencesProvider>
    </ThemeProvider>
  );
}