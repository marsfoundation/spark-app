import * as SwitchPrimitives from '@radix-ui/react-switch'
import * as React from 'react'

import { cn } from '@/ui/utils/style'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'group padding-2 inline-flex h-5 w-9 shrink-0 items-center rounded-xss transition-all ',
      'data-[state=checked]:bg-reskin-fg-system-success-primary',
      'data-[state=unchecked]:bg-reskin-bg-secondary',
      'data-[state=unchecked]:ring-1 data-[state=unchecked]:ring-reskin-border-primary',
      // hover
      'hover:data-[state=checked]:ring hover:data-[state=checked]:ring-[#01BF9F40]/25',
      'hover:data-[state=unchecked]:bg-reskin-bg-tertiary hover:data-[state=unchecked]:ring-reskin-border-secondary',
      // active (pressed)
      'active:data-[state=checked]:bg-reskin-fg-system-success-secondary active:data-[state=checked]:ring-0',
      'active:data-[state=unchecked]:bg-reskin-bg-primary active:data-[state=unchecked]:ring-reskin-border-primary',
      // disabled
      'disabled:cursor-not-allowed',
      'disabled:data-[state=checked]:bg-reskin-fg-system-success-secondary/30 disabled:data-[state=checked]:ring-0',
      'disabled:data-[state=unchecked]:bg-reskin-bg-primary disabled:data-[state=unchecked]:ring-reskin-border-primary',
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-4 w-4 rounded-xss',
        'transition-all data-[state=unchecked]:translate-x-[2px]',
        'data-[state=unchecked]:bg-reskin-bg-primary-inverse',
        'data-[state=checked]:bg-reskin-bg-primary',
        'data-[state=checked]:translate-x-[18px]',
        'data-[state=checked]:shadow-md',
        // active (pressed)
        'group-active:data-[state=unchecked]:bg-reskin-fg-tertiary',
        // disabled
        'group-disabled:data-[state=unchecked]:bg-reskin-fg-secondary-inverse',
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
