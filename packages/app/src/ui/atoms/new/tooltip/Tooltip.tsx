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

function TooltipContentHeader({ children }: ChildrenProps) {
  return <div className="flex items-center">{children}</div>
}

function TooltipContentIcon({ src }: { src: string }) {
  return <img src={src} className="mr-1 h-5 w-5 select-none" />
}

function TooltipContentTitle({ children }: ChildrenProps) {
  return <h5 className="typography-label-4">{children}</h5>
}

function TooltipContentBody({ children }: ChildrenProps) {
  return <p className="max-w-[32ch]">{children}</p>
}

const TooltipProvider = TooltipPrimitive.Provider
const RadixPrimitive = isTouchScreen() ? PopoverPrimitive : TooltipPrimitive

const Tooltip = RadixPrimitive.Root

const TooltipTrigger = RadixPrimitive.Trigger

const tooltipContentVariants = cva(
  'typography-label-6 z-50 overflow-hidden rounded-sm bg-reskin-bg-primary-inverse px-3 py-2 text-reskin-fg-primary-inverse shadow-lg ',
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
      <RadixPrimitive.Arrow width={16} height={8} className="fill-reskin-base-black" />
    </RadixPrimitive.Content>
  </RadixPrimitive.Portal>
))
TooltipContent.displayName = 'TooltipContent'

export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipContentLayout,
  TooltipContentHeader,
  TooltipContentIcon,
  TooltipContentTitle,
  TooltipContentBody,
}

function isTouchScreen(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}
