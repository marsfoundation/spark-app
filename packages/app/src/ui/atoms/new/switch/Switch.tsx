import * as SwitchPrimitives from '@radix-ui/react-switch'
import * as React from 'react'

import { cn } from '@/ui/utils/style'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'padding-2 peer inline-flex h-5 w-9 shrink-0 items-center rounded-xss transition-all ',
      'data-[state=checked]:bg-reskin-fg-system-success-primary data-[state=unchecked]:bg-reskin-bg-secondary',
      'data-[state=unchecked]:ring-1 data-[state=unchecked]:ring-reskin-border-primary',
      // hover
      'data-[state=checked]:hover:ring data-[state=checked]:hover:ring-[#01BF9F40]/25',
      'data-[state=unchecked]:hover:bg-reskin-bg-tertiary data-[state=unchecked]:hover:ring-reskin-border-secondary',
      // active (pressed)
      'data-[state=checked]:active:bg-reskin-fg-system-success-secondary data-[state=checked]:active:ring-0',
      'data-[state=unchecked]:active:bg-reskin-bg-primary data-[state=unchecked]:active:ring-reskin-border-primary',
      // disabled
      'disabled:cursor-not-allowed',
      'data-[state=checked]:disabled:bg-reskin-fg-system-success-secondary/30',
      'data-[state=unchecked]:disabled:bg-reskin-bg-primary data-[state=unchecked]:disabled:ring-reskin-border-primary',
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-4 w-4 rounded-xss',
        'transition-all data-[state=unchecked]:translate-x-[2px]',
        'data-[state=unchecked]:bg-reskin-bg-inverse-primary',
        'data-[state=checked]:bg-reskin-bg-primary',
        'data-[state=checked]:translate-x-[18px]',
        'data-[state=checked]:shadow-md',
        // active (pressed)
        'data-[state=unchecked]:active:bg-reskin-fg-tertiary',
        // disabled
        'data-[state=unchecked]:active:bg-reskin-fg-secondary-inverse',
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
