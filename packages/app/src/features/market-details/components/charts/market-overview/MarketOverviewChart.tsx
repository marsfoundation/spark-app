import { ReactNode } from 'react'

import { DoughnutChart } from '@/ui/atoms/doughnut-chart/DoughnutChart'

interface MarketOverviewChartProps {
  data: { value: number; color: string }[]
  children: ReactNode
}

export function MarketOverviewChart({ data, children }: MarketOverviewChartProps) {
  return (
    <div className="flex w-[174px] items-center justify-center justify-self-center">
      <div className="absolute">{children}</div>
      <DoughnutChart outerRadius={174} innerRadius={156} data={data} />
    </div>
  )
}
