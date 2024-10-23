import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { TxOverviewRouteItem } from '@/features/dialogs/common/types'
import { testIds } from '@/ui/utils/testIds'

export interface TransactionOutcomeProps {
  outcome: TxOverviewRouteItem
}

export function TransactionOutcome({ outcome }: TransactionOutcomeProps) {
  return (
    <div className="flex flex-col items-end gap-0.5 md:block" data-testid={testIds.dialog.transactionOverview.outcome}>
      <span>
        {outcome.token.format(outcome.value, { style: 'auto' })} {outcome.token.symbol}
      </span>
      <span> worth </span>
      <span className="font-semibold">{USD_MOCK_TOKEN.formatUSD(outcome.usdValue)}</span>
    </div>
  )
}
