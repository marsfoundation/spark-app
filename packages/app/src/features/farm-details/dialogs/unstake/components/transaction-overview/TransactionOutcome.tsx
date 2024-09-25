import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TxOverviewRouteItem } from '@/features/dialogs/common/types'
import { testIds } from '@/ui/utils/testIds'

export interface TransactionOutcomeProps {
  outcomeTokenRouteItem: TxOverviewRouteItem
  rewardToken: Token
  isExiting: boolean
  earnedRewards: NormalizedUnitNumber
}

export function TransactionOutcome({
  outcomeTokenRouteItem,
  rewardToken,
  isExiting,
  earnedRewards,
}: TransactionOutcomeProps) {
  const outcomeToken = outcomeTokenRouteItem.token
  const outcomeTokenAmount = outcomeToken.format(outcomeTokenRouteItem.value, { style: 'auto' })
  const outcomeTokenUsdValue = outcomeToken.formatUSD(outcomeTokenRouteItem.usdValue)
  const earnedRewardsAmount = rewardToken.format(earnedRewards, { style: 'auto' })
  const earnedRewardsUsdValue = rewardToken.formatUSD(earnedRewards)

  const unstakeText = `${outcomeTokenAmount} ${outcomeToken.symbol} worth ${outcomeTokenUsdValue}`
  const unstakeTextMobile = `${outcomeTokenAmount} ${outcomeToken.symbol}`
  const exitText = `${outcomeTokenAmount} ${outcomeToken.symbol} (${outcomeTokenUsdValue}) + ${earnedRewardsAmount} ${rewardToken.symbol} (${earnedRewardsUsdValue})`
  const exitTextMobile = `${outcomeTokenAmount} ${outcomeToken.symbol} + ${earnedRewardsAmount} ${rewardToken.symbol}`

  return (
    <div
      className="flex flex-col items-end gap-0.5 md:block"
      data-testid={testIds.farmDetails.unstakeDialog.transactionOverview.outcome}
    >
      {isExiting ? (
        <>
          <span className="hidden sm:inline">{exitText}</span>
          <span className="sm:hidden">{exitTextMobile}</span>
        </>
      ) : (
        <>
          <span className="hidden sm:inline">{unstakeText}</span>
          <span className="sm:hidden">{unstakeTextMobile}</span>
        </>
      )}
    </div>
  )
}
