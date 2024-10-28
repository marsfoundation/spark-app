import { assert } from '@/utils/assert'
import { VariantProps, cva } from 'class-variance-authority'
import { ComponentProps, ReactNode, createContext, forwardRef, useContext } from 'react'

import { cn } from '@/ui/utils/style'
import { BreakpointKey, useBreakpoint } from '@/ui/utils/useBreakpoint'

import { Typography } from '../typography/Typography'
import { CollapsiblePanel } from './CollapsiblePanel'

export interface PanelProps {
  children: [ReactNode, ReactNode]
  className?: string
  collapsibleOptions?: { collapsible: boolean; collapsibleAbove?: BreakpointKey; defaultOpen?: boolean }
}

const PanelContext = createContext({ collapse: false })

export interface PanelType extends React.ForwardRefExoticComponent<PanelProps & React.RefAttributes<HTMLDivElement>> {
  Wrapper: typeof PanelWrapper
  Header: typeof PanelHeader
  Title: typeof PanelTitle
  Content: typeof PanelContent
}
export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ children, className, collapsibleOptions = { collapsible: false } }, ref) => {
    const [Header, Content] = children
    const { collapsible, collapsibleAbove, defaultOpen } = collapsibleOptions
    const matchesQuery = useBreakpoint(collapsibleAbove ?? 'all')

    if (!import.meta.env.PROD) {
      // runtime checks to ensure children structure
      // @note: we might decide not to enforce header existence in the future
      // @note: use name property for equality checks to make hot code reloading work
      // rewrite to use assert
      assert(
        Header && (Header as any).type?.name === Panel.Header.name,
        'Panel.Header must be the first child of Panel',
      )
      assert(
        Content && (Content as any).type?.name === Panel.Content.name,
        'Panel.Content must be the second child of Panel',
      )
    }

    if (collapsible && matchesQuery) {
      return (
        <PanelContext.Provider value={{ collapse: true }}>
          <CollapsiblePanel defaultOpen={defaultOpen} className={className} ref={ref}>
            {Header}
            {Content}
          </CollapsiblePanel>
        </PanelContext.Provider>
      )
    }

    return (
      <PanelContext.Provider value={{ collapse: false }}>
        <Panel.Wrapper className={cn('flex flex-col gap-6 p-4 md:px-8 md:py-6', className)} ref={ref}>
          {children}
        </Panel.Wrapper>
      </PanelContext.Provider>
    )
  },
) as PanelType
Panel.displayName = 'Panel'

/**
 * Can be used to wrap any content without enforcing header and content structure. Replacement for Card
 */
interface PanelWrapperProps extends ComponentProps<'section'>, VariantProps<typeof panelWrapperVariants> {}
const PanelWrapper = forwardRef<HTMLDivElement, PanelWrapperProps>(({ className, variant, ...rest }, ref) => {
  return <section className={cn(panelWrapperVariants({ variant }), className)} {...rest} ref={ref} />
})
PanelWrapper.displayName = 'Wrapper'
Panel.Wrapper = PanelWrapper

const panelWrapperVariants = cva('rounded-lg border shadow-sm', {
  variants: {
    variant: {
      default: 'bg-panel-bg backdrop-blur-sm',
      white: 'border-basics-border bg-white',
      green: 'border-[#6DC275] bg-basics-green/5 bg-panel-bg',
      blue: 'border-[#3F66EF] bg-[#3F66EF]/10',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

function PanelHeader({ className, ...rest }: ComponentProps<'div'>) {
  const { collapse } = useContext(PanelContext)
  if (collapse) {
    return <CollapsiblePanel.Header className={className} {...rest} />
  }
  return <div className={cn('flex flex-row items-center gap-1', className)} {...rest} />
}
Panel.Header = PanelHeader

function PanelTitle(props: ComponentProps<typeof Typography>) {
  return <Typography variant="h3" {...props} />
}
Panel.Title = PanelTitle

function PanelContent(props: ComponentProps<'div'>) {
  const { collapse } = useContext(PanelContext)
  if (collapse) {
    return <CollapsiblePanel.Content {...props} />
  }
  return <div {...props} />
}
Panel.Content = PanelContent
