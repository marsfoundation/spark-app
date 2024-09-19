import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TxOverviewRouteItem } from '@/features/dialogs/common/types'
import { testIds } from '@/ui/utils/testIds'

export interface TransactionOutcomeProps {
  stakingTokenRouteItem: TxOverviewRouteItem
  rewardToken: TokenSymbol
}

export function TransactionOutcome({ stakingTokenRouteItem, rewardToken }: TransactionOutcomeProps) {
  return (
    <div
      className="flex flex-col items-end gap-0.5 md:block"
      data-testid={testIds.farmDetails.dialog.transactionOverview.outcome}
    >
      {stakingTokenRouteItem.token.format(stakingTokenRouteItem.value, { style: 'auto' })}{' '}
      {stakingTokenRouteItem.token.symbol}{' '}
      <span className="hidden sm:inline">({USD_MOCK_TOKEN.formatUSD(stakingTokenRouteItem.usdValue)}) </span>
      <span className="hidden sm:inline">staked </span> in {rewardToken} Farm
    </div>
  )
}
