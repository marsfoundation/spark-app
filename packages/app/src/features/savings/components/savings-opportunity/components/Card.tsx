import { Panel } from '@/ui/atoms/new/panel/Panel'
import { testIds } from '@/ui/utils/testIds'
import { ReactNode } from 'react'

export function Card({ children }: { children: ReactNode }) {
  return (
    <Panel
      spacing="m"
      className="grid grid-cols-1 gap-8 bg-center bg-cover bg-savings-opportunity-panel bg-no-repeat lg:grid-cols-[3fr_2fr]"
      data-testid={testIds.savings.opportunity.panel}
    >
      {children}
    </Panel>
  )
}
