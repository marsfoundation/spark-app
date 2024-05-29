import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { Panel } from '@/ui/atoms/panel/Panel'

import { MarketOverviewChart } from '../charts/market-overview/MarketOverviewChart'
import { colors } from '../charts/market-overview/colors'
import { Legend } from '../charts/market-overview/components/Legend'
import { DetailsGrid } from './components/DetailsGrid'
import { DetailsGridItem } from './components/DetailsGridItem'
import { MarketOverviewContent } from './components/MarketOvierviewContent'

export interface DefaultMarketOverviewProps {
  token: Token
  marketSize: NormalizedUnitNumber
  borrowed: NormalizedUnitNumber
  available: NormalizedUnitNumber
  utilizationRate: Percentage
}

export function DefaultMarketOverview({
  token,
  marketSize,
  borrowed,
  available,
  utilizationRate,
}: DefaultMarketOverviewProps) {
  const chartData = [
    { value: borrowed.toNumber(), color: colors.blue },
    { value: available.toNumber(), color: colors.green },
  ]

  return (
    <Panel.Wrapper>
      <MarketOverviewContent>
        <h4 className="font-semibold text-base text-sky-950 md:text-xl">Market Overview</h4>
        <MarketOverviewChart data={chartData}>
          <Legend token={token} utilized={borrowed} total={marketSize} utilizationRate={utilizationRate} />
        </MarketOverviewChart>
        <DetailsGrid>
          <DetailsGridItem token={token} title="Market size" value={marketSize} type="monetary" />
          <DetailsGridItem token={token} title="Utilization rate" value={utilizationRate} type="percentage" />
          <DetailsGridItem token={token} title="Borrowed" value={borrowed} type="monetary" titleVariant="blue" />
          <DetailsGridItem token={token} title="Available" value={available} type="monetary" titleVariant="green" />
        </DetailsGrid>
      </MarketOverviewContent>
    </Panel.Wrapper>
  )
}
