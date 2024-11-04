import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TxOverviewRouteItem } from '@/features/dialogs/common/types'
import { TokenAmount } from '@/ui/molecules/token-amount/TokenAmount'

export interface UnstakeTransactionOutcomeProps {
  outcomeTokenRouteItem: TxOverviewRouteItem
  rewardToken: Token
  isExiting: boolean
  earnedRewards: NormalizedUnitNumber
}

export function UnstakeTransactionOutcome({
  outcomeTokenRouteItem,
  rewardToken,
  isExiting,
  earnedRewards,
}: UnstakeTransactionOutcomeProps) {
  const outcomeToken = outcomeTokenRouteItem.token

  const exitContent = (() => {
    if (isExiting) {
      return (
        <div className="flex items-center gap-2">
          <TokenAmount
            token={outcomeToken}
            amount={outcomeTokenRouteItem.value}
            usdAmount={outcomeTokenRouteItem.usdValue}
            variant="horizontal"
          />
          <div className="text-secondary">+</div>
          <TokenAmount token={rewardToken} amount={earnedRewards} variant="horizontal" />
        </div>
      )
    }

    return (
      <TokenAmount
        token={outcomeToken}
        amount={outcomeTokenRouteItem.value}
        usdAmount={outcomeTokenRouteItem.usdValue}
        variant="horizontal"
      />
    )
  })()

  return exitContent
}
