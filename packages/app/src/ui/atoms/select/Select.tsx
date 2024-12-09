import * as SelectPrimitive from '@radix-ui/react-select'
import * as React from 'react'

import { assets } from '@/ui/assets'
import { cn } from '@/ui/utils/style'

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'group flex w-full items-center justify-between',
      'rounded-sm border border-primary bg-primary text-fg-primary',
      'p-3 ring-offset-base-black placeholder:text-secondary',
      'hover:border-tertiary hover:shadow-sm',
      'disabled:cursor-not-allowed disabled:border-secondary disabled:opacity-50 disabled:shadow-xs ',
      'focus-visible:outline-none focus-visible:ring focus-visible:ring-primary-200 focus-visible:ring-offset-0',
      'data-[state=open]:border-secondary data-[state=open]:shadow-sm',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <img src={assets.chevronDown} className="transition-transform group-data-[state=open]:rotate-180" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=open]:animate-in',
        'relative z-50 min-w-[8rem] overflow-hidden rounded-sm border border-primary bg-primary text-fg-primary shadow-xl',
        position === 'popper' &&
          'data-[side=left]:-translate-x-1 data-[side=top]:-translate-y-1 data-[side=right]:translate-x-1 data-[side=bottom]:translate-y-1',
        // @note: passing max-h and overflow-y-auto is important to make scroll when there is not enough vertical space
        //   - https://github.com/radix-ui/primitives/issues/1980#issuecomment-1773071441
        //   - https://github.com/shadcn-ui/ui/issues/1175#issuecomment-1791453202
        'max-h-[var(--radix-select-content-available-height)] overflow-y-auto',
        className,
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          'divide-y divide-primary',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center px-3 py-4 outline-none',
      'hover:cursor-pointer hover:bg-secondary',
      'active:bg-tertiary',
      'focus-visible:bg-secondary',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

// not a complete list of elements - refer to https://ui.shadcn.com/docs/components/select for more
export { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger }
