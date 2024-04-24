import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import * as React from 'react'

import { cn } from '@/ui/utils/style'

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const baseTooltipContentClassList = cn(
  'z-50 overflow-hidden',
  'outline outline-1 outline-black/5',
  'shadow-tooltip rounded-md bg-popover',
)

const tooltipContentShortClassList = cn(
  baseTooltipContentClassList,
  'text-sm text-slate-500 max-w-[80vw] sm:max-w-[32ch] px-3 py-1.5 space-y-2',
)
const tooltipContentLongClassList = cn(baseTooltipContentClassList, 'px-5 py-4')

const TooltipContentShort = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, children, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(tooltipContentShortClassList, className)}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
      <TooltipPrimitive.Arrow width={16} height={8} fill="white" />
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
))
TooltipContentShort.displayName = 'TooltipContentShort'

const TooltipContentLong = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, children, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(tooltipContentLongClassList, className)}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
      <TooltipPrimitive.Arrow width={16} height={8} fill="white" />
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
))
TooltipContentLong.displayName = 'TooltipContentLong'

export { Tooltip, TooltipContentLong, TooltipContentShort, TooltipProvider, TooltipTrigger }
