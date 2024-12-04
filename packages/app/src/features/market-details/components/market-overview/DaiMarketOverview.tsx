import { Token } from '@/domain/types/Token'
import { NormalizedUnitNumber, Percentage } from '@marsfoundation/common-universal'
import { DssAutoline } from '../../types'
import { Legend } from './components/LegendItem'
import { MarketOverviewChart, colors } from './components/MarketOverviewChart'
import { MarketOverviewContent } from './components/MarketOvierviewContent'

export interface DaiMarketOverviewProps {
  token: Token
  borrowed: NormalizedUnitNumber
  instantlyAvailable: NormalizedUnitNumber
  skyCapacity: NormalizedUnitNumber
  marketSize: NormalizedUnitNumber
  totalAvailable: NormalizedUnitNumber
  utilizationRate: Percentage
  dssAutoline: DssAutoline
}

export function DaiMarketOverview({
  token,
  marketSize,
  borrowed,
  instantlyAvailable,
  skyCapacity,
  utilizationRate,
}: DaiMarketOverviewProps) {
  const chartData = [
    { value: borrowed.toNumber(), color: colors.borrow },
    { value: instantlyAvailable.toNumber(), color: colors.available },
    { value: skyCapacity.toNumber(), color: colors.sky },
  ]

  return (
    <MarketOverviewContent>
      <MarketOverviewChart
        data={chartData}
        token={token}
        marketSize={marketSize}
        borrowed={borrowed}
        utilizationRate={utilizationRate}
        className="max-w-md px-12"
      />
      <Legend>
        <Legend.Item variant="borrowed" token={token} value={borrowed} />
        <Legend.Item variant="instantly-available" token={token} value={instantlyAvailable} />
        <Legend.Item variant="sky-capacity" token={token} value={skyCapacity} />
      </Legend>
    </MarketOverviewContent>
  )
}
