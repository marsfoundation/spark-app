import { ReactNode } from 'react'

import { Panel } from '@/ui/atoms/panel/Panel'
import { testIds } from '@/ui/utils/testIds'

import { DialogPanelTitle } from '../DialogPanelTitle'

interface SuccessViewSummaryPanelProps {
  title?: string
  children: ReactNode
}

export function SuccessViewSummaryPanel({ title, children }: SuccessViewSummaryPanelProps) {
  return (
    <Panel.Wrapper className='mt-8 flex w-full flex-col gap-4 bg-panel-bg p-4'>
      {title && <DialogPanelTitle>{title}</DialogPanelTitle>}
      <div className="flex items-center justify-between" data-testid={testIds.dialog.success}>
        {children}
      </div>
    </Panel.Wrapper>
  )
}
