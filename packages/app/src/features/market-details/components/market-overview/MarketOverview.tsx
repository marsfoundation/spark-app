import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

import { DaiMarketOverview } from './DaiMarketOverview'
import { DefaultMarketOverview } from './DefaultMarketOverview'

export type MarketOverviewProps = { token: Token } & (
  | {
      type: 'default'
      marketSize: NormalizedUnitNumber
      borrowed: NormalizedUnitNumber
      available: NormalizedUnitNumber
      utilizationRate: Percentage
    }
  | {
      type: 'dai'
      marketSize: NormalizedUnitNumber
      borrowed: NormalizedUnitNumber
      instantlyAvailable: NormalizedUnitNumber
      makerDaoCapacity: NormalizedUnitNumber
      totalAvailable: NormalizedUnitNumber
      utilizationRate: Percentage
    }
)

export function MarketOverview(props: MarketOverviewProps) {
  if (props.type === 'dai') {
    return <DaiMarketOverview {...props} />
  }

  return <DefaultMarketOverview {...props} />
}
