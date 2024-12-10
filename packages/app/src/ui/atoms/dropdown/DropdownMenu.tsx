import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import * as React from 'react'

import { cn } from '@/ui/utils/style'
import { VariantProps, cva } from 'class-variance-authority'
import { MenuItem, MenuItemIcon } from '../menu-item/MenuItem'

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
      'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-primary p-1',
      'text-primary shadow-lg data-[state=closed]:animate-out',
      'data-[state=open]:animate-in',
      className,
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName

const dropdownContentVariants = cva(
  cn(
    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
    'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
    'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
    'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
    'z-50 min-w-[8rem] overflow-hidden rounded-sm border border-primary',
    'text-primary shadow-md data-[state=closed]:animate-out',
    'data-[state=open]:animate-in',
  ),
  {
    variants: {
      variant: {
        primary: 'bg-primary',
        secondary: 'bg-secondary',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> & VariantProps<typeof dropdownContentVariants>
>(({ className, sideOffset = 4, variant, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(dropdownContentVariants({ variant }), className)}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const dropdownItemVariants = cva(
  cn(
    'typography-button-2 group relative flex cursor-default select-none items-center',
    'gap-2 rounded-sm p-4 text-primary outline-none focus:outline-none ',
    'transition-colors data-[disabled]:pointer-events-none ',
    'w-full justify-start data-[disabled]:opacity-50',
  ),
  {
    variants: {
      variant: {
        primary: 'bg-primary focus:bg-secondary',
        secondary: 'bg-primary focus:bg-tertiary',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & VariantProps<typeof dropdownItemVariants>
>(({ className, variant, ...props }, ref) => (
  <MenuItem asChild variant={variant} className={className}>
    <DropdownMenuPrimitive.Item ref={ref} {...props} />
  </MenuItem>
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn('typography-label-4 px-4 py-1 text-secondary', className)}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator ref={ref} className={cn('-mx-1 my-1 h-px bg-neutral-100', className)} {...props} />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  MenuItemIcon as DropdownMenuItemIcon,
}
