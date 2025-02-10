import * as React from "react"

import { cn } from "@/lib/utils"

const TextureCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl shadow-elevation-light  dark:shadow-elevation-dark  w-full dark:bg-card",
      className
    )}
    {...props}
  >
    {children}
  </div>
))

TextureCard.displayName = "TextureCard"

const TextureCardPrimary = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-[24px] border border-black/10 shadow-sm dark:border-stone-950/60",
      "bg-gradient-to-b dark:from-neutral-800 dark:to-neutral-900 from-neutral-100 to-white/70",

      className
    )}
    {...props}
  >
    {/* Nested structure for aesthetic borders */}
    <div className="rounded-[23px] border  dark:border-neutral-900/80 border-black/10 ">
      <div className="rounded-[22px] border  dark:border-neutral-950 border-white/50 ">
        <div className="rounded-[21px] border  dark:border-neutral-900/70  border-neutral-950/20  ">
          {/* Inner content wrapper */}
          <div className=" w-full border border-white/50 dark:border-neutral-700/50 rounded-[20px] text-neutral-500 bg-card/20 text-card-foreground ">
            {children}
          </div>
        </div>
      </div>
    </div>
  </div>
))

TextureCardPrimary.displayName = "TextureCardPrimary"

const TextureCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "first:pt-6 last:pb-6", // Adjust padding for first and last child
      className
    )}
    {...props}
  />
))
TextureCardHeader.displayName = "TextureCardHeader"

const TextureCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-tight text-neutral-900 dark:text-neutral-100",
      className
    )}
    {...props}
  />
))
TextureCardTitle.displayName = "TextureCardTitle"

const TextureCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-neutral-600 dark:text-neutral-400", className)}
    {...props}
  />
))
TextureCardDescription.displayName = "TextureCardDescription"

const TextureCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-6 py-4", className)} {...props} />
))
TextureCardContent.displayName = "TextureCardContent"

const TextureCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between px-6 py-4  gap-2",

      className
    )}
    {...props}
  />
))
TextureCardFooter.displayName = "TextureCardFooter"

const TextureSeparator = () => {
  return (
    <div className="border border-t-neutral-50 border-b-neutral-300/50 dark:border-t-neutral-950 dark:border-b-neutral-700/50 border-l-transparent border-r-transparent" />
  )
}

const TextureSeparatorVertical = ({ className }) => {
  return (
    <div
      className={cn(
        "border border-t-neutral-50 border-b-neutral-300/50 dark:border-t-neutral-950 dark:border-b-neutral-700/50 border-l-transparent border-r-transparent ",
        className
      )}
    />
  )
}

export {
  TextureCard,
  TextureCardPrimary,
  TextureCardHeader,
  TextureCardFooter,
  TextureCardTitle,
  TextureSeparator,
  TextureSeparatorVertical,
  TextureCardDescription,
  TextureCardContent,
}

export default TextureCard
