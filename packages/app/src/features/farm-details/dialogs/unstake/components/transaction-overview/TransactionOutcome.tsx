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

  const [textContent, mobileTextContent] = (() => {
    if (isExiting) {
      const exitText = `${outcomeTokenAmount} ${outcomeToken.symbol} (${outcomeTokenUsdValue}) + ${earnedRewardsAmount} ${rewardToken.symbol} (${earnedRewardsUsdValue})`
      const exitTextMobile = `${outcomeTokenAmount} ${outcomeToken.symbol} + ${earnedRewardsAmount} ${rewardToken.symbol}`
      return [exitText, exitTextMobile]
    }
    const unstakeText = `${outcomeTokenAmount} ${outcomeToken.symbol} worth ${outcomeTokenUsdValue}`
    const unstakeTextMobile = `${outcomeTokenAmount} ${outcomeToken.symbol}`
    return [unstakeText, unstakeTextMobile]
  })()

  return (
    <div
      className="flex flex-col items-end gap-0.5 md:block"
      data-testid={testIds.farmDetails.unstakeDialog.transactionOverview.outcome}
    >
      <span className="hidden sm:inline">{textContent}</span>
      <span className="sm:hidden">{mobileTextContent}</span>
    </div>
  )
}
