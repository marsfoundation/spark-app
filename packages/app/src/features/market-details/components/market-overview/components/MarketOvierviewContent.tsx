import { ReactNode } from 'react'

interface MarketOverviewContentProps {
  children: ReactNode
}

export function MarketOverviewContent({ children }: MarketOverviewContentProps) {
  return <div className="grid gap-9 p-4 md:px-8 md:py-6">{children}</div>
}
