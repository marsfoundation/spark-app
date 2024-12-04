import { Panel } from '@/ui/atoms/new/panel/Panel'
import { ReactNode } from 'react'

interface MarketOverviewContentProps {
  children: ReactNode
}

export function MarketOverviewContent({ children }: MarketOverviewContentProps) {
  return (
    <Panel variant="secondary" className="flex flex-col items-center gap-10">
      <h4 className="typography-heading-5 text-primary-inverse">Market Overview</h4>
      {children}
    </Panel>
  )
}
