import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-[0_10px_30px_rgba(17,24,39,0.16)] hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_18px_40px_rgba(17,24,39,0.18)]',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-border bg-white/70 backdrop-blur-xl hover:-translate-y-0.5 hover:bg-white hover:text-accent-foreground hover:shadow-lg',
        secondary:
          'bg-secondary text-secondary-foreground hover:-translate-y-0.5 hover:bg-secondary/80 hover:shadow-md',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        gradient:
          'bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 text-white shadow-[0_16px_40px_rgba(79,70,229,0.28)] hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(79,70,229,0.34)]',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-10 rounded-full px-4',
        lg: 'h-12 rounded-full px-8 text-base',
        icon: 'h-11 w-11 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
