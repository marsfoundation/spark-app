import { Panel } from '@/ui/atoms/new/panel/Panel'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { ReactNode } from 'react'

export interface CardProps {
  hasNoCash?: boolean
  children: ReactNode
}

export function Card({ children, hasNoCash }: CardProps) {
  return (
    <Panel
      spacing="m"
      className={cn(
        'grid grid-cols-1 gap-8 bg-center bg-cover',
        'bg-savings-opportunity-panel bg-no-repeat lg:grid-cols-[3fr_2fr]',
        hasNoCash && 'gap-6 lg:grid-cols-1',
      )}
      data-testid={testIds.savings.opportunity.panel}
    >
      {children}
    </Panel>
  )
}
