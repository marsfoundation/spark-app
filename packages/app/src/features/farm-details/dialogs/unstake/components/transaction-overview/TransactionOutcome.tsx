import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TxOverviewRouteItem } from '@/features/dialogs/common/types'
import { testIds } from '@/ui/utils/testIds'

export interface TransactionOutcomeProps {
  outcomeTokenRouteItem: TxOverviewRouteItem
  rewardToken: TokenSymbol
}

export function TransactionOutcome({ outcomeTokenRouteItem }: TransactionOutcomeProps) {
  return (
    <div
      className="flex flex-col items-end gap-0.5 md:block"
      data-testid={testIds.farmDetails.unstakeDialog.transactionOverview.outcome}
    >
      {outcomeTokenRouteItem.token.format(outcomeTokenRouteItem.value, { style: 'auto' })}{' '}
      {outcomeTokenRouteItem.token.symbol}
      <span className="hidden sm:inline"> worth {USD_MOCK_TOKEN.formatUSD(outcomeTokenRouteItem.usdValue)} </span>
    </div>
  )
}
