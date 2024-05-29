import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { Panel } from '@/ui/atoms/panel/Panel'

import { colors } from '../charts/market-overview/colors'
import { Legend } from '../charts/market-overview/components/Legend'
import { MarketOverviewChart } from '../charts/market-overview/MarketOverviewChart'
import { DetailsGrid } from './components/DetailsGrid'
import { DetailsGridItem } from './components/DetailsGridItem'
import { MarketOverviewContent } from './components/MarketOvierviewContent'

export interface DaiMarketOverviewProps {
  token: Token
  borrowed: NormalizedUnitNumber
  instantlyAvailable: NormalizedUnitNumber
  makerDaoCapacity: NormalizedUnitNumber
  marketSize: NormalizedUnitNumber
  totalAvailable: NormalizedUnitNumber
  utilizationRate: Percentage
}

export function DaiMarketOverview({
  token,
  marketSize,
  borrowed,
  instantlyAvailable,
  makerDaoCapacity,
  totalAvailable,
  utilizationRate,
}: DaiMarketOverviewProps) {
  const chartData = [
    { value: borrowed.toNumber(), color: colors.blue },
    { value: instantlyAvailable.toNumber(), color: colors.green },
    { value: makerDaoCapacity.toNumber(), color: colors.orange },
  ]

  return (
    <Panel.Wrapper>
      <MarketOverviewContent>
        <h4 className='font-semibold text-base text-sky-950 md:text-xl'>Market Overview</h4>
        <MarketOverviewChart data={chartData}>
          <Legend token={token} utilized={borrowed} total={marketSize} utilizationRate={utilizationRate} />
        </MarketOverviewChart>
        <DetailsGrid>
          <DetailsGridItem token={token} title="Borrowed" value={borrowed} type="monetary" titleVariant="blue" />
          <DetailsGridItem token={token} title="Market size" value={marketSize} type="monetary" />
          <DetailsGridItem token={token} title="Total available" value={totalAvailable} type="monetary" />
          <DetailsGridItem token={token} title="Utilization rate" value={utilizationRate} type="percentage" />
          <DetailsGridItem
            token={token}
            title="Instantly available"
            value={instantlyAvailable}
            type="monetary"
            titleVariant="green"
          />
          <DetailsGridItem
            token={token}
            title="MakerDAO capacity"
            value={makerDaoCapacity}
            type="monetary"
            titleVariant="orange"
          />
        </DetailsGrid>
      </MarketOverviewContent>
    </Panel.Wrapper>
  )
}
