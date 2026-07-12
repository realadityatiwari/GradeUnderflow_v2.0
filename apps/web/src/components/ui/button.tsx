import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-indigo-500 text-white shadow-[0_12px_25px_-14px_rgba(99,102,241,0.95)] hover:-translate-y-px hover:bg-indigo-400 hover:shadow-[0_16px_30px_-14px_rgba(99,102,241,0.8)]",
        destructive:
          "bg-rose-500 text-white shadow-[0_12px_25px_-14px_rgba(244,63,94,0.85)] hover:-translate-y-px hover:bg-rose-400",
        outline: "border border-white/[0.11] bg-white/[0.025] text-zinc-200 shadow-sm hover:-translate-y-px hover:border-white/[0.18] hover:bg-white/[0.07] hover:text-white",
        secondary: "bg-white/[0.08] text-zinc-200 shadow-sm hover:-translate-y-px hover:bg-white/[0.13] hover:text-white",
        ghost: "text-zinc-400 hover:bg-white/[0.07] hover:text-zinc-100",
        link: "h-auto px-0 text-indigo-300 underline-offset-4 hover:text-indigo-200 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-5 text-sm",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
