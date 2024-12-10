import { Content, Header, Item, Root, Trigger } from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/ui/utils/style'

const Accordion = Root

const AccordionItem = React.forwardRef<React.ElementRef<typeof Item>, React.ComponentPropsWithoutRef<typeof Item>>(
  ({ className, ...props }, ref) => (
    <Item ref={ref} className={cn('border-primary border-b last:border-none', className)} {...props} />
  ),
)
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof Trigger>,
  React.ComponentPropsWithoutRef<typeof Trigger>
>(({ className, children, ...props }, ref) => (
  <Header className="flex">
    <Trigger
      ref={ref}
      className={cn(
        'typography-label-2 flex flex-1 items-center justify-between py-4 text-primary transition-all [&[data-state=open]>svg]:rotate-180',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-6 w-6 shrink-0 text-primary transition-transform duration-200" />
    </Trigger>
  </Header>
))
AccordionTrigger.displayName = Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof Content>,
  React.ComponentPropsWithoutRef<typeof Content>
>(({ className, children, ...props }, ref) => (
  <Content
    ref={ref}
    className="typography-body-2 overflow-hidden text-secondary transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('pt-0 pb-4', className)}>{children}</div>
  </Content>
))

AccordionContent.displayName = Content.displayName

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
