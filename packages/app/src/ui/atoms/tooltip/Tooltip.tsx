import * as PopoverPrimitive from '@radix-ui/react-popover'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import * as React from 'react'

import { cn } from '@/ui/utils/style'
import { VariantProps, cva } from 'class-variance-authority'

interface ChildrenProps {
  children: React.ReactNode
}

function TooltipContentLayout({ children }: ChildrenProps) {
  return <div className="flex flex-col gap-3">{children}</div>
}

function TooltipContentLayoutHeader({ children }: ChildrenProps) {
  return <div className="flex items-center">{children}</div>
}

function TooltipContentLayoutIcon({ src }: { src: string }) {
  return <img src={src} className="mr-1 h-5 w-5 select-none" />
}

function TooltipContentLayoutTitle({ children }: ChildrenProps) {
  return <h5 className="typography-label-2">{children}</h5>
}

function TooltipContentLayoutBody({ children }: ChildrenProps) {
  return <p className="max-w-[32ch]">{children}</p>
}

TooltipContentLayout.Header = TooltipContentLayoutHeader
TooltipContentLayout.Icon = TooltipContentLayoutIcon
TooltipContentLayout.Title = TooltipContentLayoutTitle
TooltipContentLayout.Body = TooltipContentLayoutBody

const TooltipProvider = TooltipPrimitive.Provider
const RadixPrimitive = isTouchScreen() ? PopoverPrimitive : TooltipPrimitive

const Tooltip = RadixPrimitive.Root

const TooltipTrigger = RadixPrimitive.Trigger

const tooltipContentVariants = cva(
  cn(
    'typography-label-4 z-50 overflow-hidden rounded-sm bg-primary-inverse',
    'border-primary/25 border-t px-3 py-2 text-fg-primary-inverse shadow-glow-lg',
  ),
  {
    variants: {
      variant: {
        short: 'max-w-[80vw] space-y-2 px-3 py-1.5 sm:max-w-[32ch]',
        long: '',
      },
    },
    defaultVariants: {
      variant: 'short',
    },
  },
)

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof RadixPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof RadixPrimitive.Content> & VariantProps<typeof tooltipContentVariants>
>(({ className, sideOffset = 4, children, variant, ...props }, ref) => (
  <RadixPrimitive.Portal>
    <RadixPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(tooltipContentVariants({ variant }), className)}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
      <RadixPrimitive.Arrow width={16} height={8} className="text-primary" asChild>
        <svg width="16" height="8" viewBox="0 0 17 9" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.1442 0C15.0351 0 16.5 0 16.5 0L8.78023 7.77818C8.3897 8.16871 7.75654 8.16871 7.36601 7.77818L0.5 0H2.00206H14.1442Z" />
        </svg>
      </RadixPrimitive.Arrow>
    </RadixPrimitive.Content>
  </RadixPrimitive.Portal>
))
TooltipContent.displayName = 'TooltipContent'

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TooltipContentLayout }

function isTouchScreen(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}
