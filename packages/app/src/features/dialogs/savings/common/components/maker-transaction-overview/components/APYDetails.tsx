import { formatPercentage } from '@/domain/common/format'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'

export interface APYDetailsProps {
  APY: Percentage
  daiEarnRate: NormalizedUnitNumber
}

export function APYDetails({ APY, daiEarnRate }: APYDetailsProps) {
  return (
    <div className="flex flex-col items-end gap-0.5">
      <div>{formatPercentage(APY)}</div>
      <div className="text-basics-dark-grey text-sm">Earn ~{USD_MOCK_TOKEN.formatUSD(daiEarnRate)} DAI per year</div>
    </div>
  )
}
