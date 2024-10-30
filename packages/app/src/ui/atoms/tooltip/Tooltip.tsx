import * as PopoverPrimitive from '@radix-ui/react-popover'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import * as React from 'react'

import { cn } from '@/ui/utils/style'

const TooltipProvider = TooltipPrimitive.Provider
const RadixPrimitive = isTouchScreen() ? PopoverPrimitive : TooltipPrimitive

const Tooltip = RadixPrimitive.Root

const TooltipTrigger = RadixPrimitive.Trigger

const baseTooltipContentClassList = cn(
  'z-50 overflow-hidden',
  'outline outline-1 outline-black/5',
  'rounded-md bg-popover shadow-tooltip',
)

const tooltipContentShortClassList = cn(
  baseTooltipContentClassList,
  'max-w-[80vw] space-y-2 px-3 py-1.5 text-sm text-white sm:max-w-[32ch]',
)
const tooltipContentLongClassList = cn(baseTooltipContentClassList, 'px-5 py-4')

const TooltipContentShort = React.forwardRef<
  React.ElementRef<typeof RadixPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof RadixPrimitive.Content>
>(({ className, sideOffset = 4, children, ...props }, ref) => (
  <RadixPrimitive.Portal>
    <RadixPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(tooltipContentShortClassList, className)}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
      <RadixPrimitive.Arrow width={16} height={8} fill="white" />
    </RadixPrimitive.Content>
  </RadixPrimitive.Portal>
))
TooltipContentShort.displayName = 'TooltipContentShort'

const TooltipContentLong = React.forwardRef<
  React.ElementRef<typeof RadixPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof RadixPrimitive.Content>
>(({ className, sideOffset = 4, children, ...props }, ref) => (
  <RadixPrimitive.Portal>
    <RadixPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(tooltipContentLongClassList, className)}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
      <RadixPrimitive.Arrow width={16} height={8} fill="white" />
    </RadixPrimitive.Content>
  </RadixPrimitive.Portal>
))
TooltipContentLong.displayName = 'TooltipContentLong'

export { Tooltip, TooltipContentLong, TooltipContentShort, TooltipProvider, TooltipTrigger }

function isTouchScreen(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}
