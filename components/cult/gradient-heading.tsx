import React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const headingVariants = cva(
  "tracking-wider pb-3 bg-clip-text text-transparent",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-t from-stone-900/80 to-stone-950/90 dark:from-stone-100/80 dark:to-stone-50/90",
        pink: "bg-gradient-to-t from-accent to-accent/90 dark:from-stone-200 dark:to-zinc-200",
        light: "bg-gradient-to-t from-zinc-300 to-zinc-400",
        lightTwo: "bg-gradient-to-t from-white to-background",
        secondary: "bg-gradient-to-t from-primary-foreground to-primary",
        subtext:
          "bg-gradient-to-t from-muted-foreground/80 to-card-foreground/80",
      },
      size: {
        default: "text-3xl sm:text-4xl lg:text-5xl",
        xxs: "text-base sm:text-lg lg:text-lg",
        xs: "text-lg sm:text-xl lg:text-2xl",
        sm: "text-xl sm:text-2xl lg:text-3xl",
        md: "text-2xl sm:text-3xl lg:text-4xl",
        lg: "text-3xl sm:text-4xl lg:text-5xl",
        xl: "text-4xl sm:text-5xl lg:text-6xl",
        xxl: "text-5xl sm:text-6xl lg:text-[6rem]",
        xxxl: "text-5xl sm:text-6xl lg:text-[8rem]",
      },
      weight: {
        default: "font-bold",
        thin: "font-thin",
        base: "font-base",
        semi: "font-semibold",
        bold: "font-bold",
        black: "font-black",
      },
      tracking: {
        default: "tracking-tight",
        tighter: "tracking-tighter",
        tight: "tracking-tight",
        normal: "tracking-normal",
        wide: "tracking-wide",
        wider: "tracking-wider",
        widest: "tracking-widest",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      weight: "default",
      tracking: "default",
    },
  }
)

export interface HeadingProps extends VariantProps<typeof headingVariants> {
  asChild?: boolean
  children: React.ReactNode
  className?: string
}

const GradientHeading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    { asChild, variant, weight, size, tracking, className, children, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "h3" // default to 'h3' if not a child
    return (
      <Comp ref={ref} {...props} className={cn("text-center", className)}>
        <span
          className={cn(headingVariants({ variant, size, weight, tracking }))}
        >
          {children}
        </span>
      </Comp>
    )
  }
)

GradientHeading.displayName = "GradientHeading"

// Manually define the variant types
export type Variant = "default" | "pink" | "light" | "secondary" | "subtext"
export type Size =
  | "default"
  | "xxs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "xxl"
  | "xxxl"
export type Weight = "default" | "thin" | "base" | "semi" | "bold" | "black"
export type Tracking =
  | "default"
  | "tighter"
  | "tight"
  | "normal"
  | "wide"
  | "wider"
  | "widest"

export { GradientHeading, headingVariants }
