'use client';  // Marks this as a client-side component in Next.js, required for components that use browser APIs

// Import necessary dependencies
import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

/**
 * Toaster component that provides toast notifications
 * Integrates with the theme system for consistent styling
 * Features:
 * - Theme-aware styling
 * - Customizable position and duration
 * - Rich content support
 * - Keyboard navigation
 * @param props - Sonner Toaster props
 */
const Toaster = ({ ...props }) => {
  // Get the current theme from next-themes, defaulting to 'system' if not set
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      // Apply the current theme to the toast notifications
      theme={theme as 'light' | 'dark' | 'system'}
      // Add base classes for the toaster container
      className="toaster group"
      // Configure custom styling for different parts of the toast
      toastOptions={{
        classNames: {
          // Main toast container styling
          // Uses Tailwind classes to match the app's design system
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          // Description text styling
          description: 'group-[.toast]:text-muted-foreground',
          // Action button styling (e.g., "Undo" buttons)
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          // Cancel button styling
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      // Pass through any additional props to the Sonner component
      {...props}
    />
  );
}

// Export the custom Toaster component
export { Toaster };
