'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { cn } from '@/lib/utils';

/**
 * ThemeToggle component for switching between light and dark themes
 * Features:
 * - Constant black background with white text
 * - Smooth hover effect
 * - Accessible with high contrast ratio
 * - Clear icon indication of current theme
 * - Smooth transition animations
 */
export function ThemeToggle() {
  const { preferences, toggleTheme } = useUserPreferences();

  const label = {
    light: 'Light',
    dark: 'Dark',
  }[preferences.theme];

  const isLight = preferences.theme === 'light';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "relative h-9 w-9 rounded-md bg-black text-white hover:bg-gray-800 transition-colors duration-200",
        "focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      )}
      aria-label={`Switch to ${label} theme`}
    >
      <Sun 
        className={cn(
          "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 text-white",
          "dark:-rotate-90 dark:scale-0"
        )} 
      />
      <Moon 
        className={cn(
          "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 text-white",
          "dark:rotate-0 dark:scale-100"
        )} 
      />
      <span className="sr-only">{label} mode</span>
    </Button>
  );
}