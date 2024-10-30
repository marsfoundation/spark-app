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
      'data-[state=unchecked]:bg-secondary',
      'data-[state=unchecked]:ring-1 data-[state=unchecked]:ring-reskin-neutral-100',
      // hover
      'hover:data-[state=checked]:bg-reskin-fg-system-success-secondary',
      'hover:data-[state=unchecked]:bg-tertiary hover:data-[state=unchecked]:ring-reskin-neutral-300',
      // focus
      'focus-visible:data-[state=checked]:outline focus-visible:data-[state=checked]:outline-1 focus-visible:data-[state=checked]:outline-system-success-secondary',
      'focus-visible:data-[state=checked]:ring-4 focus-visible:data-[state=checked]:ring-reskin-success-200',
      'focus-visible:data-[state=unchecked]:outline focus-visible:data-[state=unchecked]:outline-1 focus-visible:data-[state=unchecked]:outline-brand-primary',
      'focus-visible:data-[state=unchecked]:ring-4 focus-visible:data-[state=unchecked]:ring-reskin-primary-200',
      // active (pressed)
      'active:data-[state=checked]:bg-reskin-success-400 active:data-[state=checked]:ring-0',
      'active:data-[state=unchecked]:bg-primary active:data-[state=unchecked]:ring-reskin-neutral-100',
      // disabled
      'disabled:cursor-not-allowed',
      'disabled:data-[state=checked]:bg-reskin-fg-system-success-secondary/30 disabled:data-[state=checked]:ring-0',
      'disabled:data-[state=unchecked]:bg-primary disabled:data-[state=unchecked]:ring-reskin-neutral-100',
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-4 w-4 rounded-xss',
        'transition-all data-[state=unchecked]:translate-x-[2px]',
        'data-[state=unchecked]:bg-primary-inverse',
        'data-[state=checked]:bg-primary',
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
