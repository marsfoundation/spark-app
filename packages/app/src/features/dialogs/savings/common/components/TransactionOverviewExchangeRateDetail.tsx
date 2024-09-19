import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TransactionOverviewDetailsItem } from '@/features/dialogs/common/components/transaction-overview/TransactionOverviewDetailsItem'
import { assets } from '@/ui/assets'
import { TokenValue } from './TokenValue'

export interface TransactionOverviewDetailsItemProps {
  toToken: Token
  fromToken: Token
  ratio: NormalizedUnitNumber
  'data-testid'?: string
}

export function TransactionOverviewExchangeRateDetail({
  fromToken,
  toToken,
  ratio,
  'data-testid': dataTestId,
}: TransactionOverviewDetailsItemProps) {
  return (
    <TransactionOverviewDetailsItem label="Exchange Rate" data-testid={dataTestId}>
      <div className="flex flex-row gap-2">
        <TokenValue token={fromToken} value={NormalizedUnitNumber(1)} variant="high-precision" />{' '}
        <img src={assets.arrowRight} />
        <TokenValue token={toToken} value={ratio} variant="high-precision" />
      </div>
    </TransactionOverviewDetailsItem>
  )
}
