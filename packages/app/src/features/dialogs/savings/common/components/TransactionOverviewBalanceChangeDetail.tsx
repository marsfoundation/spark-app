import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TransactionOverviewDetailsItem } from '@/features/dialogs/common/components/TransactionOverviewDetailsItem'
import { assets } from '@/ui/assets'

import { TokenValue } from './TokenValue'

export interface TransactionOverviewBalanceChangeDetailProps {
  token: Token
  before: NormalizedUnitNumber
  after: NormalizedUnitNumber
  'data-testid'?: string
}

export function TransactionOverviewBalanceChangeDetail({
  token,
  after,
  before,
  'data-testid': dataTestId,
}: TransactionOverviewBalanceChangeDetailProps) {
  return (
    <TransactionOverviewDetailsItem label={`${token.symbol} Balance`} data-testid={dataTestId}>
      <div className="flex flex-row gap-2">
        <TokenValue token={token} value={before} variant="auto-precision" /> <img src={assets.arrowRight} />
        <TokenValue token={token} value={after} variant="auto-precision" />
      </div>
    </TransactionOverviewDetailsItem>
  )
}
