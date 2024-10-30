import * as SwitchPrimitives from '@radix-ui/react-switch'
import * as React from 'react'

import { cn } from '@/ui/utils/style'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'data-[state=checked]:bg-primary-bg data-[state=unchecked]:bg-white/30',
      'padding-2 peer inline-flex h-5 w-9 shrink-0 items-center rounded-sm',
      'cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
      'outline outline-1 outline-black/10 transition-colors',
      'focus-visible:ring-ring focus-visible:ring-offset-background',
      'focus-visible:ring-2 focus-visible:ring-offset-2',
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-4 w-4 rounded-sm',
        'ring-0 transition-transform',
        'data-[state=unchecked]:translate-x-[2px]',
        'data-[state=unchecked]:bg-black',
        'data-[state=checked]:bg-white',
        'data-[state=checked]:translate-x-[18px]',
        'data-[state=checked]:shadow-md',
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
