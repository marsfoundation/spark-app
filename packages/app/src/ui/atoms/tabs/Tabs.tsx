import * as TabsPrimitive from '@radix-ui/react-tabs'
import * as React from 'react'

import { cn } from '@/ui/utils/style'
import { VariantProps, cva } from 'class-variance-authority'

const Tabs = TabsPrimitive.Root

const tabsListVariants = cva('inline-flex w-full flex-wrap items-center justify-center rounded-sm bg-secondary', {
  variants: {
    size: {
      l: 'typography-label-4 gap-2 p-1.5',
      s: 'typography-label-6 gap-0.5 p-0.5',
    },
  },
  defaultVariants: {
    size: 'l',
  },
})

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>
>(({ className, size, ...props }, ref) => (
  <TabsPrimitive.List ref={ref} className={cn(tabsListVariants({ size }), className)} {...props} />
))
TabsList.displayName = TabsPrimitive.List.displayName

const tabsTriggerVariants = cva(
  cn(
    'flex-1 whitespace-nowrap rounded-[6px] border border-transparent ease-in ',
    'bg-secondary text-secondary transition-colors hover:bg-tertiary',
    'data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary data-[state=active]:shadow-xs', // shows the blue bar for the active tab
    'focus-visible:outline-none focus-visible:ring focus-visible:ring-primary-200 focus-visible:ring-offset-0',
  ),
  {
    variants: {
      size: {
        l: 'p-2 md:px-4',
        s: 'p-1.5 md:px-2',
      },
    },
    defaultVariants: {
      size: 'l',
    },
  },
)

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & VariantProps<typeof tabsTriggerVariants>
>(({ className, size, ...props }, ref) => (
  <TabsPrimitive.Trigger ref={ref} className={cn(tabsTriggerVariants({ size }), className)} {...props} />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'data-[state=active]:mt-3 focus-visible:outline-none focus-visible:ring focus-visible:ring-primary-200 focus-visible:ring-offset-0',
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsContent, TabsList, TabsTrigger }
