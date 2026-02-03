import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "hover" | "bordered";
  glow?: "none" | "cyan" | "purple" | "gold";
}

const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, variant = "default", glow = "none", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl backdrop-blur-xl border transition-all duration-300",
          // Base glass styles
          "bg-card/80 border-border/50",
          // Variants
          variant === "hover" && "hover:bg-card/90 hover:border-primary/30",
          variant === "bordered" && "border-2",
          // Glow effects
          glow === "cyan" && "neon-glow-cyan",
          glow === "purple" && "neon-glow-purple",
          glow === "gold" && "neon-glow-gold",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassPanel.displayName = "GlassPanel";

export { GlassPanel };
