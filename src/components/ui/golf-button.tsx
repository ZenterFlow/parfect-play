import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const golfButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md",
        fairway: "bg-golf-fairway text-foreground hover:bg-golf-fairway/80 shadow-md",
        green: "bg-golf-green text-foreground hover:bg-golf-green/80 shadow-md",
        tee: "bg-golf-tee text-foreground hover:bg-golf-tee/80 shadow-md",
        outline: "border border-border bg-card hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        success: "bg-success text-success-foreground hover:bg-success/90 shadow-md",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 shadow-md",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface GolfButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof golfButtonVariants> {
  asChild?: boolean
}

const GolfButton = React.forwardRef<HTMLButtonElement, GolfButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(golfButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
GolfButton.displayName = "GolfButton"

export { GolfButton, golfButtonVariants }