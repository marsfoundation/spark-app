import { ReactNode } from 'react'

import { Panel } from '@/ui/atoms/panel/Panel'
import { cn } from '@/ui/utils/style'

export interface TransactionOverviewWrapperProps {
  children: ReactNode
  className?: string
}
export function DialogPanel({ children, className }: TransactionOverviewWrapperProps) {
  return <Panel.Wrapper className={cn('bg-panel-bg flex flex-col p-4', className)}>{children}</Panel.Wrapper>
}
