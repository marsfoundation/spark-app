import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { ReactNode } from 'react'
import { SuccessViewPanelTitle } from './SuccessPanelTitle'
import { SuccessViewPanel } from './SuccessViewPanel'

interface SuccessViewSummaryPanelProps {
  title?: string
  className?: string
  children: ReactNode
}

export function SuccessViewSummaryPanel({ title, children, className }: SuccessViewSummaryPanelProps) {
  return (
    <SuccessViewPanel>
      {title && <SuccessViewPanelTitle>{title}</SuccessViewPanelTitle>}
      <div className={cn('flex items-center justify-between', className)} data-testid={testIds.dialog.success}>
        {children}
      </div>
    </SuccessViewPanel>
  )
}
