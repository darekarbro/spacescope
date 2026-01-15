"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { BackgroundGradient } from '@/components/ui/background-gradient';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'elevated';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const baseClasses = 'rounded-lg p-6';

    // Use CSS variables with fallbacks to ensure theme values apply
    const bgVar = "var(--color-card, var(--card, #ffffff))";
    const fgVar = "var(--color-card-foreground, var(--card-foreground, #0f172a))";
    const borderVar = "var(--color-border, var(--border, #e5e7eb))";

    const style: React.CSSProperties = {};

    let classNames = baseClasses;

    // Use BackgroundGradient as a common border for all card variants
    const innerStyle: React.CSSProperties = {
      backgroundColor: bgVar,
      color: fgVar,
      borderColor: borderVar,
    };

    const innerClasses = cn('rounded-lg p-6', variant === 'elevated' ? 'shadow-lg' : '', className);

    return (
      <BackgroundGradient containerClassName="p-[2px] rounded-lg" radiusClass="rounded-lg">
        <div ref={ref} className={innerClasses} style={innerStyle} {...props} />
      </BackgroundGradient>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('mb-4', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn('text-2xl font-bold', className)} {...props} />
));
CardTitle.displayName = 'CardTitle';

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
));
CardContent.displayName = 'CardContent';
