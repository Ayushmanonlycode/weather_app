import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Input component that provides a styled text input field
 * Supports all standard HTML input attributes and custom styling
 * Features:
 * - Consistent styling with the design system
 * - Support for different input types
 * - File input specific styles
 * - Focus and disabled states
 * @param props - HTML input attributes
 * @param ref - Forwarded ref for the input element
 */
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
