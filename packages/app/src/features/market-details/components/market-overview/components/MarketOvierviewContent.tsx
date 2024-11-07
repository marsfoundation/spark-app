import { Panel } from '@/ui/atoms/new/panel/Panel'
import { ReactNode } from 'react'

interface MarketOverviewContentProps {
  children: ReactNode
}

export function MarketOverviewContent({ children }: MarketOverviewContentProps) {
  return <Panel className="grid gap-9">{children}</Panel>
}
