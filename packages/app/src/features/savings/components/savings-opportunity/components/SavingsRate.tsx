import { SupportedChainId } from '@/config/chain/types'
import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { SavingsMetaItem } from '@/features/savings/logic/makeSavingsMeta'
import { Info } from '@/ui/molecules/info/Info'
import { SavingsRateTooltipContent } from '../../savings-rate-tooltip-content/SavingsRateTooltipContent'

export interface SavingsRateProps {
  originChainId: SupportedChainId
  savingsMetaItem: SavingsMetaItem
  APY: Percentage
}

export function SavingsRate({ originChainId, APY, savingsMetaItem }: SavingsRateProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <div className="typography-label-1 text-primary-inverse">{savingsMetaItem.rateAcronym} Rate</div>
        <Info className="icon-sm text-secondary">
          <SavingsRateTooltipContent originChainId={originChainId} savingsMetaItem={savingsMetaItem} />
        </Info>
      </div>
      <div className="typography-display-1 bg-gradient-savings-opportunity-savings-rate bg-clip-text text-transparent">
        {formatPercentage(APY, { minimumFractionDigits: 0 })}
      </div>
    </div>
  )
}
