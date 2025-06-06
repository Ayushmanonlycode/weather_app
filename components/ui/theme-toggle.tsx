'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { cn } from '@/lib/utils';

/**
 * ThemeToggle component for switching between light and dark themes
 * Features:
 * - Uses user preferences hook for state management
 * - Ghost variant button
 * - Icon size
 * - Animated icon transition
 * - Accessible with aria-label and screen reader text
 * - Smooth icon rotation and scaling animations
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
        "relative h-9 w-9 rounded-md",
        isLight && 'text-white'
      )}
      aria-label={`Switch to ${label} theme`}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">{label} mode</span>
    </Button>
  );
}