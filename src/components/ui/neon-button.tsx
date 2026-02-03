import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const neonButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        cyan: [
          "bg-primary text-primary-foreground",
          "hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5),0_0_40px_hsl(var(--neon-cyan)/0.3)]",
          "hover:scale-105",
          "active:scale-100",
        ],
        purple: [
          "bg-secondary text-secondary-foreground",
          "hover:shadow-[0_0_20px_hsl(var(--neon-purple)/0.5),0_0_40px_hsl(var(--neon-purple)/0.3)]",
          "hover:scale-105",
          "active:scale-100",
        ],
        gold: [
          "bg-accent text-accent-foreground",
          "hover:shadow-[0_0_20px_hsl(var(--neon-gold)/0.5),0_0_40px_hsl(var(--neon-gold)/0.3)]",
          "hover:scale-105",
          "active:scale-100",
        ],
        outline: [
          "border-2 border-primary bg-transparent text-primary",
          "hover:bg-primary/10",
          "hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.3)]",
        ],
        ghost: [
          "bg-transparent text-foreground",
          "hover:bg-muted",
          "hover:text-primary",
        ],
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        xl: "h-16 px-10 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "cyan",
      size: "default",
    },
  }
);

export interface NeonButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof neonButtonVariants> {
  asChild?: boolean;
}

const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(neonButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
NeonButton.displayName = "NeonButton";

export { NeonButton, neonButtonVariants };
