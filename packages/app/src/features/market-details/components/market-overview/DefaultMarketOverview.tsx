import { formatPercentage } from '@/domain/common/format'
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
        <h4 className="font-semibold text-base md:text-xl">Market Overview</h4>
        <MarketOverviewChart data={chartData}>
          <Legend token={token} utilized={borrowed} total={marketSize} utilizationRate={utilizationRate} />
        </MarketOverviewChart>
        <DetailsGrid>
          <DetailsGridItem>
            <DetailsGridItem.Title>Market size</DetailsGridItem.Title>
            <DetailsGridItem.Value>{token.formatUSD(marketSize, { compact: true })}</DetailsGridItem.Value>
          </DetailsGridItem>
          <DetailsGridItem>
            <DetailsGridItem.Title>Utilization rate</DetailsGridItem.Title>
            <DetailsGridItem.Value>{formatPercentage(utilizationRate)}</DetailsGridItem.Value>
          </DetailsGridItem>
          <DetailsGridItem>
            <DetailsGridItem.Title variant="blue">Borrowed</DetailsGridItem.Title>
            <DetailsGridItem.Value>{token.formatUSD(borrowed, { compact: true })}</DetailsGridItem.Value>
          </DetailsGridItem>
          <DetailsGridItem>
            <DetailsGridItem.Title variant="green">Available</DetailsGridItem.Title>
            <DetailsGridItem.Value>{token.formatUSD(available, { compact: true })}</DetailsGridItem.Value>
          </DetailsGridItem>
        </DetailsGrid>
      </MarketOverviewContent>
    </Panel.Wrapper>
  )
}
