import { Panel } from '@/ui/atoms/new/panel/Panel'
import { cn } from '@/ui/utils/style'
import { ReactNode } from 'react'

export interface SuccessViewPanelProps {
  children: ReactNode
  'data-testid'?: string
  className?: string
}

export function SuccessViewPanel({ children, 'data-testid': dataTestId, className }: SuccessViewPanelProps) {
  return (
    <Panel className={cn('mt-8 flex w-full flex-col bg-secondary', className)} spacing="s" data-testid={dataTestId}>
      {children}
    </Panel>
  )
}
