import { ReactNode } from 'react'

import { Panel } from '@/ui/atoms/panel/Panel'
import { cn } from '@/ui/utils/style'

export interface TransactionOverviewWrapperProps {
  children: ReactNode
  className?: string
}
export function DialogPanel({ children, className }: TransactionOverviewWrapperProps) {
  return <Panel.Wrapper className={cn('flex flex-col bg-panel-bg p-4', className)}>{children}</Panel.Wrapper>
}
