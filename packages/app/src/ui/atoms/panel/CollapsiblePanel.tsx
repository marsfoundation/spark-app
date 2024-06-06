import { assert } from '@/utils/assert'
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import { ChevronDown, ChevronUp } from 'lucide-react'
import React, { ComponentProps, forwardRef, ReactNode, useState } from 'react'

import { cn } from '@/ui/utils/style'

import { Typography } from '../typography/Typography'

export interface CollapsibleRawPanelProps {
  children: [ReactNode, ReactNode]
  defaultOpen?: boolean
  className?: string
}

const CollapsiblePanelContext = React.createContext({ open: true })

export interface CollapsiblePanelType
  extends React.ForwardRefExoticComponent<CollapsibleRawPanelProps & React.RefAttributes<HTMLDivElement>> {
  Header: typeof PanelHeader
  Title: typeof PanelTitle
  Content: typeof PanelContent
}

// @note This component is an integral part of a Panel component and shouldn't be used directly
export const CollapsiblePanel: CollapsiblePanelType = forwardRef<HTMLDivElement, CollapsibleRawPanelProps>(
  ({ children, defaultOpen = true, className }, ref) => {
    const [Header, Body] = children
    const [open, setOpen] = useState(defaultOpen)

    if (!import.meta.env.PROD) {
      // Runtime checks for children structure in development
      const [Header, Content] = children
      assert(
        Header && (Header as any).type?.name === CollapsiblePanel.Header.name,
        'CollapsiblePanel.Header must be the first child of CollapsiblePanel',
      )
      assert(
        Content && (Content as any).type?.name === CollapsiblePanel.Content.name,
        'CollapsiblePanel.Content must be the second child of CollapsiblePanel',
      )
    }

    return (
      <CollapsiblePrimitive.Root open={open} onOpenChange={setOpen}>
        <section
          className={cn(
            'flex flex-col gap-6 rounded-lg border border-panel-border bg-inherit bg-white px-6 py-4 shadow-sm',
            className,
          )}
          ref={ref}
        >
          <CollapsiblePanelContext.Provider value={{ open }}>{Header}</CollapsiblePanelContext.Provider>
          {Body}
        </section>
      </CollapsiblePrimitive.Root>
    )
  },
) as CollapsiblePanelType
CollapsiblePanel.displayName = 'CollapsiblePanel'

function PanelHeader({ className, ...rest }: JSX.IntrinsicElements['div']) {
  const { open } = React.useContext(CollapsiblePanelContext)

  return (
    <div className="flex flex-row justify-between" {...rest}>
      <div className={cn('flex flex-row items-center gap-1', className)}>{rest.children}</div>
      <div className="flex cursor-pointer flex-col justify-center">
        <CollapsiblePrimitive.CollapsibleTrigger asChild>
          <button role="switch" className="cursor-pointer">
            <Typography variant="prompt">
              {open ? (
                <>
                  Hide
                  <ChevronUp className="-translate-y-[1px] ml-1 inline-block" size={16} />
                </>
              ) : (
                <>
                  Show
                  <ChevronDown className="-translate-y-[1px] ml-1 inline-block" size={16} />
                </>
              )}
            </Typography>
          </button>
        </CollapsiblePrimitive.CollapsibleTrigger>
      </div>
    </div>
  )
}
CollapsiblePanel.Header = PanelHeader

function PanelTitle(props: ComponentProps<typeof Typography>) {
  return <Typography variant="h3" {...props} />
}
CollapsiblePanel.Title = PanelTitle

function PanelContent(props: CollapsiblePrimitive.CollapsibleContentProps) {
  return <CollapsiblePrimitive.CollapsibleContent {...props} />
}

CollapsiblePanel.Content = PanelContent
