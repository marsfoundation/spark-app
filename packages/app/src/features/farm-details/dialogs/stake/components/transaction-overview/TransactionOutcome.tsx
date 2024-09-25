import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TxOverviewRouteItem } from '@/features/dialogs/common/types'
import { testIds } from '@/ui/utils/testIds'

export interface TransactionOutcomeProps {
  stakingTokenRouteItem: TxOverviewRouteItem
  rewardToken: TokenSymbol
}

export function TransactionOutcome({ stakingTokenRouteItem, rewardToken }: TransactionOutcomeProps) {
  const stakingToken = stakingTokenRouteItem.token
  const stakingTokenAmount = stakingToken.format(stakingTokenRouteItem.value, { style: 'auto' })
  const stakingTokenUsdValue = stakingToken.formatUSD(stakingTokenRouteItem.usdValue)

  const mobileText = `${stakingTokenAmount} ${stakingToken.symbol} in Farm`
  const text = `${stakingTokenAmount} ${stakingToken.symbol} (${stakingTokenUsdValue}) deposited into ${rewardToken} Farm`

  return (
    <div
      className="flex flex-col items-end gap-0.5 md:block"
      data-testid={testIds.farmDetails.stakeDialog.transactionOverview.outcome}
    >
      <span className="sm:hidden">{mobileText}</span>
      <span className="hidden sm:inline">{text}</span>
    </div>
  )
}
