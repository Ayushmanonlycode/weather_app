import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Card component that serves as a container for content
 * Provides a consistent style for card-based layouts
 * @param props - HTML div attributes
 * @param ref - Forwarded ref for the card element
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

/**
 * CardHeader component for the header section of a card
 * Contains title and description components
 * @param props - HTML div attributes
 * @param ref - Forwarded ref for the header element
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

/**
 * CardTitle component for the main title of a card
 * Uses h3 element with appropriate styling
 * @param props - HTML heading attributes
 * @param ref - Forwarded ref for the title element
 */
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

/**
 * CardDescription component for additional text in the card header
 * Uses muted text color for secondary information
 * @param props - HTML paragraph attributes
 * @param ref - Forwarded ref for the description element
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

/**
 * CardContent component for the main content area of a card
 * Provides consistent padding and spacing
 * @param props - HTML div attributes
 * @param ref - Forwarded ref for the content element
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
};
