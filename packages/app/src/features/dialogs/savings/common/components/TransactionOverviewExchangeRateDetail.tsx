import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TransactionOverviewDetailsItem } from '@/features/dialogs/common/components/TransactionOverviewDetailsItem'
import { assets } from '@/ui/assets'

import { TokenValue } from './TokenValue'

export interface TransactionOverviewDetailsItemProps {
  toToken: Token
  fromToken: Token
  ratio: NormalizedUnitNumber
}

export function TransactionOverviewExchangeRateDetail({
  fromToken,
  toToken,
  ratio,
}: TransactionOverviewDetailsItemProps) {
  return (
    <TransactionOverviewDetailsItem label="Exchange Rate">
      <div className="flex flex-row gap-2">
        <TokenValue token={fromToken} value={NormalizedUnitNumber(1)} variant="high-precision" />{' '}
        <img src={assets.arrowRight} />
        <TokenValue token={toToken} value={ratio} variant="high-precision" />
      </div>
    </TransactionOverviewDetailsItem>
  )
}
